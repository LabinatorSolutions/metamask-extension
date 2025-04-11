export const REMOTE_MODE_SLIDE = {
  id: 'remoteMode',
  title: 'slideRemoteModeTitle',
  description: 'slideRemoteModeDescription',
  // TODO: Update image once we have a remote mode icon
  image: './images/slide-fund-icon.svg',
  href: '/home.html#remote',
};

export const SWEEPSTAKES_SLIDE = {
  id: 'sweepStake',
  title: 'slideSweepStakeTitle',
  description: 'slideSweepStakeDescription',
  image: './images/sweepstakes.png',
  href: 'https://portfolio.metamask.io/explore/nfts?event=012e19e2',
};

export const FUND_SLIDE = {
  id: 'fund',
  title: 'slideFundWalletTitle',
  description: 'slideFundWalletDescription',
  image: './images/slide-fund-icon.svg',
  href: 'https://portfolio.metamask.io/buy/build-quote',
};

///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
export const BRIDGE_SLIDE = {
  id: 'bridge',
  title: 'slideBridgeTitle',
  description: 'slideBridgeDescription',
  image: './images/slide-bridge-icon.svg',
};
///: END:ONLY_INCLUDE_IF

export const CARD_SLIDE = {
  id: 'card',
  title: 'slideDebitCardTitle',
  description: 'slideDebitCardDescription',
  image: './images/slide-card-icon.svg',
  href: 'https://portfolio.metamask.io/card',
};

export const CASH_SLIDE = {
  id: 'cash',
  title: 'slideCashOutTitle',
  description: 'slideCashOutDescription',
  image: './images/slide-sell-icon.svg',
  href: 'https://portfolio.metamask.io/sell',
};

export const MULTI_SRP_SLIDE = {
  id: 'multiSrp',
  title: 'slideMultiSrpTitle',
  description: 'slideMultiSrpDescription',
  image: './images/slide-multi-srp-icon.svg',
};

export const ZERO_BALANCE = '0x0';

export const SWEEPSTAKES_START = new Date('2025-04-09T00:00:00Z');
export const SWEEPSTAKES_END = new Date('2025-04-15T23:59:59Z');
