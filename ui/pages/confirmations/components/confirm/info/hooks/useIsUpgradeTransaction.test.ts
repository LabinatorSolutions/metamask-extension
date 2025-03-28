import { AuthorizationList } from '@metamask/transaction-controller';
import { genUnapprovedContractInteractionConfirmation } from '../../../../../../../test/data/confirmations/contract-interaction';
import { getMockConfirmStateForTransaction } from '../../../../../../../test/data/confirmations/helper';
import { renderHookWithConfirmContextProvider } from '../../../../../../../test/lib/confirmations/render-helpers';
import { EIP_7702_REVOKE_ADDRESS } from '../../../../hooks/useEIP7702Account';
import {
  useIsDowngradeTransaction,
  useIsUpgradeTransaction,
} from './useIsUpgradeTransaction';

function runUpgradeHook(authorizationList?: AuthorizationList) {
  const transaction = genUnapprovedContractInteractionConfirmation({
    authorizationList,
  });

  const state = getMockConfirmStateForTransaction(transaction);

  const { result } = renderHookWithConfirmContextProvider(
    useIsUpgradeTransaction,
    state,
  );

  return result.current as boolean;
}

function runDowngradeHook(authorizationList?: AuthorizationList) {
  const transaction = genUnapprovedContractInteractionConfirmation({
    authorizationList,
  });

  const state = getMockConfirmStateForTransaction(transaction);

  const { result } = renderHookWithConfirmContextProvider(
    useIsDowngradeTransaction,
    state,
  );

  return result.current as boolean;
}

describe('useIsUpgradeTransaction', () => {
  it('returns true if authorization address is not empty', async () => {
    const result = runUpgradeHook([{ address: '0x123' }]);
    expect(result).toBe(true);
  });

  it.each([undefined, null, []] as const)(
    'returns false if authorizationList is %s',
    async (authorizationList) => {
      const result = runUpgradeHook(
        authorizationList as unknown as AuthorizationList,
      );
      expect(result).toBe(false);
    },
  );

  it('returns false if authorization address is zero address', async () => {
    const result = runUpgradeHook([{ address: EIP_7702_REVOKE_ADDRESS }]);
    expect(result).toBe(false);
  });
});

describe('useIsDowngradeTransaction', () => {
  it('returns true if authorization address is zero address', async () => {
    const result = runDowngradeHook([{ address: EIP_7702_REVOKE_ADDRESS }]);
    expect(result).toBe(true);
  });

  it.each([undefined, null, []] as const)(
    'returns false if authorization address is %s',
    async (authorizationList) => {
      const result = runDowngradeHook(
        authorizationList as unknown as AuthorizationList,
      );
      expect(result).toBe(false);
    },
  );

  it('returns false if authorization address is other address', async () => {
    const result = runDowngradeHook([{ address: '0x123' }]);
    expect(result).toBe(false);
  });
});
