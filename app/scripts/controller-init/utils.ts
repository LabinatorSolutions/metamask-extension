import { createProjectLogger } from '@metamask/utils';
import {
  BaseControllerMessenger,
  BaseRestrictedControllerMessenger,
  ControllerByName,
  ControllerInitFunction,
  ControllerInitRequest,
  ControllerName,
} from './types';
import { Controller } from './controller-list';
import { CONTROLLER_MESSENGERS } from './messengers';

const log = createProjectLogger('controller-init');

/** Result of initializing controllers. */
export type InitControllersResult = {
  /** All API methods exposed by the controllers. */
  controllerApi: Record<string, Controller>;

  /** All controllers that provided a memory state key. */
  controllerMemState: Record<string, Controller>;

  /** All controllers that provided a persisted state key. */
  controllerPersistedState: Record<string, Controller>;

  /** All initialized controllers keyed by name. */
  controllersByName: ControllerByName;
};

type BaseControllerInitRequest = ControllerInitRequest<
  BaseRestrictedControllerMessenger,
  BaseRestrictedControllerMessenger | void
>;

type ControllerMessengerCallback = (
  BaseControllerMessenger: BaseControllerMessenger,
) => BaseRestrictedControllerMessenger;

export type ControllersToInitialize =
  | 'AuthenticationController'
  | 'CronjobController'
  | 'ExecutionService'
  | 'MultichainAssetsController'
  | 'MultichainAssetsRatesController'
  | 'MultichainBalancesController'
  | 'MultichainNetworkController'
  | 'MultichainTransactionsController'
  | 'NotificationServicesController'
  | 'NotificationServicesPushController'
  | 'RateLimitController'
  | 'SnapsRegistry'
  | 'SnapController'
  | 'SnapInsightsController'
  | 'SnapInterfaceController'
  | 'PPOMController'
  | 'TransactionController'
  | 'UserStorageController';

type InitFunction<Name extends ControllersToInitialize> =
  ControllerInitFunction<
    ControllerByName[Name],
    // @ts-expect-error TODO: Resolve mismatch between base-controller versions.
    ReturnType<(typeof CONTROLLER_MESSENGERS)[Name]['getMessenger']>,
    ReturnType<(typeof CONTROLLER_MESSENGERS)[Name]['getInitMessenger']>
  >;

export type InitFunctions = Partial<{
  [name in ControllersToInitialize]: InitFunction<name>;
}>;

/**
 * Initialize the controllers according to the provided init objects.
 * Each init object can be a function that returns a controller, or a `ControllerInit` instance.
 *
 * @param options - Options bag.
 * @param options.baseControllerMessenger - Unrestricted base controller messenger.
 * @param options.existingControllers - All required controllers that have already been initialized.
 * @param options.initFunctions - Map of init functions keyed by controller name.
 * @param options.initRequest - Base request used to initialize the controllers.
 * Excluding the properties that are generated by this function.
 * @returns The initialized controllers and associated data.
 */
export function initControllers({
  baseControllerMessenger,
  existingControllers = [],
  initFunctions,
  initRequest,
}: {
  baseControllerMessenger: BaseControllerMessenger;
  existingControllers?: Controller[];
  initFunctions: InitFunctions;
  initRequest: Omit<
    BaseControllerInitRequest,
    'controllerMessenger' | 'getController' | 'initMessenger'
  >;
}): InitControllersResult {
  log('Initializing controllers', Object.keys(initFunctions).length);

  const partialControllersByName = existingControllers.reduce<
    Partial<ControllerByName>
  >((acc, controller) => {
    // @ts-expect-error: Union too complex.
    acc[controller.name] = controller;
    return acc;
  }, {});

  const controllerPersistedState: Record<string, Controller> = {};
  const controllerMemState: Record<string, Controller> = {};
  let controllerApi = {};

  const getController = <Name extends ControllerName>(
    name: Name,
  ): ControllerByName[Name] =>
    getControllerOrThrow(partialControllersByName as ControllerByName, name);

  for (const [key, value] of Object.entries(initFunctions)) {
    const controllerName = key as ControllersToInitialize;
    const initFunction = value as InitFunction<typeof controllerName>;
    const messengerCallbacks = CONTROLLER_MESSENGERS[controllerName];

    const controllerMessengerCallback =
      messengerCallbacks?.getMessenger as ControllerMessengerCallback;

    const initMessengerCallback =
      messengerCallbacks?.getInitMessenger as ControllerMessengerCallback;

    const controllerMessenger = controllerMessengerCallback?.(
      baseControllerMessenger,
    );

    const initMessenger = initMessengerCallback?.(baseControllerMessenger);

    const finalInitRequest: BaseControllerInitRequest = {
      ...initRequest,
      controllerMessenger,
      getController,
      initMessenger,
    };

    const result = initFunction({
      ...finalInitRequest,
      controllerMessenger: finalInitRequest.controllerMessenger,
    });

    const {
      controller,
      persistedStateKey: persistedStateKeyRaw,
      memStateKey: memStateKeyRaw,
    } = result;

    const api = result.api ?? {};

    const persistedStateKey =
      persistedStateKeyRaw === null
        ? undefined
        : persistedStateKeyRaw ?? controllerName;

    const memStateKey =
      memStateKeyRaw === null ? undefined : memStateKeyRaw ?? controllerName;

    // @ts-expect-error: Union too complex.
    partialControllersByName[controllerName] = controller;

    controllerApi = {
      ...controllerApi,
      ...api,
    };

    if (persistedStateKey) {
      controllerPersistedState[persistedStateKey] = controller;
    }

    if (memStateKey) {
      controllerMemState[memStateKey] = controller;
    }

    log('Initialized controller', controllerName, {
      api: Object.keys(api),
      persistedStateKey,
      memStateKey,
    });
  }

  return {
    controllerApi,
    controllerMemState,
    controllerPersistedState,
    controllersByName: partialControllersByName as ControllerByName,
  };
}

function getControllerOrThrow<Name extends ControllerName>(
  controllersByName: ControllerByName,
  name: Name,
): ControllerByName[Name] {
  const controller = controllersByName[name];

  if (!controller) {
    throw new Error(`Controller requested before it was initialized: ${name}`);
  }

  return controller;
}
