import React from 'react';
import { NotificationServicesController } from '@metamask/notification-services-controller';
import { t } from '../../../../../shared/lib/translate';
import { type ExtractedNotification, isOfTypeNodeGuard } from '../node-guard';
import {
  NotificationComponentType,
  type NotificationComponent,
} from '../types/notifications/notifications';

import {
  NotificationListItem,
  NotificationDetailInfo,
  NotificationDetailNetworkFee,
  NotificationDetailBlockExplorerButton,
  NotificationDetailTitle,
  NotificationDetailAsset,
  NotificationDetailCopyButton,
  NotificationDetailAddress,
} from '../../../../components/multichain';
import { NotificationListItemIconType } from '../../../../components/multichain/notification-list-item-icon/notification-list-item-icon';
import {
  BadgeWrapperPosition,
  IconName,
} from '../../../../components/component-library';

import {
  createTextItems,
  getAmount,
  formatIsoDateString,
  getNetworkDetailsByChainId,
  getUsdAmount,
} from '../../../../helpers/utils/notification.util';
import {
  TextVariant,
  BackgroundColor,
  TextColor,
} from '../../../../helpers/constants/design-system';

const { TRIGGER_TYPES } = NotificationServicesController.Constants;

type StakeNotification = ExtractedNotification<
  | NotificationServicesController.Constants.TRIGGER_TYPES.ROCKETPOOL_STAKE_COMPLETED
  | NotificationServicesController.Constants.TRIGGER_TYPES.ROCKETPOOL_UNSTAKE_COMPLETED
  | NotificationServicesController.Constants.TRIGGER_TYPES.LIDO_STAKE_COMPLETED
  | NotificationServicesController.Constants.TRIGGER_TYPES.LIDO_WITHDRAWAL_COMPLETED
>;
const isStakeNotification = isOfTypeNodeGuard([
  TRIGGER_TYPES.ROCKETPOOL_STAKE_COMPLETED,
  TRIGGER_TYPES.ROCKETPOOL_UNSTAKE_COMPLETED,
  TRIGGER_TYPES.LIDO_STAKE_COMPLETED,
  TRIGGER_TYPES.LIDO_WITHDRAWAL_COMPLETED,
]);

const TITLE_MAP = {
  [TRIGGER_TYPES.LIDO_STAKE_COMPLETED]: t('notificationItemStaked'),
  [TRIGGER_TYPES.LIDO_WITHDRAWAL_COMPLETED]: t(
    'notificationItemUnStakeCompleted',
  ),
  [TRIGGER_TYPES.ROCKETPOOL_STAKE_COMPLETED]: t(
    'notificationItemStakeCompleted',
  ),
  [TRIGGER_TYPES.ROCKETPOOL_UNSTAKE_COMPLETED]: t(
    'notificationItemUnStakeCompleted',
  ),
};

const DIRECTION_MAP = {
  [TRIGGER_TYPES.ROCKETPOOL_STAKE_COMPLETED]: 'staked',
  [TRIGGER_TYPES.ROCKETPOOL_UNSTAKE_COMPLETED]: 'unstaked',
  [TRIGGER_TYPES.LIDO_STAKE_COMPLETED]: 'staked',
  [TRIGGER_TYPES.LIDO_WITHDRAWAL_COMPLETED]: 'unstaked',
} as const;

const STAKING_PROVIDER_MAP = {
  [TRIGGER_TYPES.LIDO_STAKE_COMPLETED]: 'Lido-staked ETH',
  [TRIGGER_TYPES.LIDO_WITHDRAWAL_COMPLETED]: 'Lido-staked ETH',
  [TRIGGER_TYPES.ROCKETPOOL_STAKE_COMPLETED]: 'Rocket Pool-staked ETH',
  [TRIGGER_TYPES.ROCKETPOOL_UNSTAKE_COMPLETED]: 'Rocket Pool-staked ETH',
};

const getTitle = (n: StakeNotification) => {
  // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const items = createTextItems([TITLE_MAP[n.type] || ''], TextVariant.bodySm);
  return items;
};

const getDescription = (n: StakeNotification) => {
  const direction = DIRECTION_MAP[n.type];
  const items = createTextItems(
    [direction === 'staked' ? n.data.stake_out.symbol : n.data.stake_in.symbol],
    TextVariant.bodyMd,
  );
  return items;
};

export const components: NotificationComponent<StakeNotification> = {
  guardFn: isStakeNotification,
  item: ({ notification, onClick }) => {
    const direction = DIRECTION_MAP[notification.type];
    const stakingProp =
      direction === 'staked'
        ? notification.data.stake_in
        : notification.data.stake_out;

    const amount = getAmount(stakingProp.amount, stakingProp.decimals, {
      shouldEllipse: true,
    });
    return (
      <NotificationListItem
        id={notification.id}
        isRead={notification.isRead}
        icon={{
          type: NotificationListItemIconType.Token,
          value: notification.data.stake_out.image,
          badge: {
            icon: IconName.Stake,
            position: BadgeWrapperPosition.bottomRight,
          },
        }}
        title={getTitle(notification)}
        description={getDescription(notification)}
        createdAt={new Date(notification.createdAt)}
        amount={`${amount} ${
          direction === 'staked'
            ? notification.data.stake_in.symbol
            : notification.data.stake_out.symbol
        }`}
        onClick={onClick}
      />
    );
  },
  details: {
    title: ({ notification }) => {
      const direction = DIRECTION_MAP[notification.type];
      const title =
        direction === 'staked'
          ? `${t('notificationItemStaked')} ${
              notification.data.stake_in.symbol
            }`
          : `${t('notificationItemUnStaked')} ${
              notification.data.stake_in.symbol
            }`;
      return (
        <NotificationDetailTitle
          title={title}
          date={formatIsoDateString(notification.createdAt)}
        />
      );
    },
    body: {
      type: NotificationComponentType.OnChainBody,
      Account: ({ notification }) => {
        if (!notification.address) {
          return null;
        }
        return (
          <NotificationDetailAddress
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            side={t('account') || ''}
            address={notification.address}
          />
        );
      },
      Asset: ({ notification }) => {
        const direction = DIRECTION_MAP[notification.type];
        const { nativeCurrencyLogo } = getNetworkDetailsByChainId(
          notification.chain_id,
        );
        return (
          <NotificationDetailAsset
            icon={{
              src: notification.data.stake_in.image,
              badge: {
                src: nativeCurrencyLogo,
                position: BadgeWrapperPosition.topRight,
              },
            }}
            label={
              direction === 'staked'
                ? // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  t('notificationItemStaked') || ''
                : // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  t('notificationItemUnStaked') || ''
            }
            detail={notification.data.stake_in.symbol}
            fiatValue={`$${getUsdAmount(
              notification.data.stake_in.amount,
              notification.data.stake_in.decimals,
              notification.data.stake_in.usd,
            )}`}
            value={`${getAmount(
              notification.data.stake_in.amount,
              notification.data.stake_in.decimals,
              { shouldEllipse: true },
            )} ${notification.data.stake_in.symbol}`}
          />
        );
      },
      AssetReceived: ({ notification }) => {
        const { nativeCurrencyLogo } = getNetworkDetailsByChainId(
          notification.chain_id,
        );
        return (
          <NotificationDetailAsset
            icon={{
              src: notification.data.stake_out.image,
              badge: {
                src: nativeCurrencyLogo,
                position: BadgeWrapperPosition.topRight,
              },
            }}
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            label={t('notificationItemReceived') || ''}
            detail={notification.data.stake_out.symbol}
            fiatValue={`$${getUsdAmount(
              notification.data.stake_out.amount,
              notification.data.stake_out.decimals,
              notification.data.stake_out.usd,
            )}`}
            value={`${getAmount(
              notification.data.stake_out.amount,
              notification.data.stake_out.decimals,
              { shouldEllipse: true },
            )} ${notification.data.stake_out.symbol}`}
          />
        );
      },
      Status: ({ notification }) => (
        <NotificationDetailInfo
          icon={{
            iconName: IconName.Check,
            color: TextColor.successDefault,
            backgroundColor: BackgroundColor.successMuted,
          }}
          // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          label={t('notificationItemStatus') || ''}
          // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          detail={t('notificationItemConfirmed') || ''}
          action={
            <NotificationDetailCopyButton
              notification={notification}
              text={notification.tx_hash}
              // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              displayText={t('notificationItemTransactionId') || ''}
            />
          }
        />
      ),
      Provider: ({ notification }) => {
        const direction = DIRECTION_MAP[notification.type];
        const provider = STAKING_PROVIDER_MAP[notification.type];

        return (
          <NotificationDetailAsset
            icon={{
              src: notification.data.stake_out.image,
              badge: {
                src:
                  direction === 'staked'
                    ? notification.data.stake_out.image
                    : notification.data.stake_in.image,
              },
            }}
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            label={t('notificationItemStakingProvider') || ''}
            detail={provider}
          />
        );
      },
      NetworkFee: ({ notification }) => {
        return <NotificationDetailNetworkFee notification={notification} />;
      },
    },
  },
  footer: {
    type: NotificationComponentType.OnChainFooter,
    ScanLink: ({ notification }) => {
      return (
        <NotificationDetailBlockExplorerButton
          notification={notification}
          chainId={notification.chain_id}
          txHash={notification.tx_hash}
        />
      );
    },
  },
};
