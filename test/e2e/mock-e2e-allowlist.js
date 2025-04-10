// Please do not add any more items to this list.
// This list is temporary and the goal is to reduce it to 0, meaning all requests are mocked in our e2e tests.
const ALLOWLISTED_URLS = [
  'https://accounts.google.com/ListAccounts?gpsia=1&source=ChromiumBrowser&json=standard',
  'https://acl.execution.metamask.io/latest/registry.json',
  'https://acl.execution.metamask.io/latest/signature.json',
  'https://api-v2.lens.dev/',
  'https://api.lens.dev/',
  'https://api.segment.io/v1/batch',
  'https://api.segment.io/v1/i',
  'https://api.segment.io/v1/t',
  'https://authentication.api.cx.metamask.io/siwe/verify',
  'https://bafkreifvhjdf6ve4jfv6qytqtux5nd4nwnelioeiqx5x2ez5yrgrzk7ypi.ipfs.dweb.link/',
  'https://bafybeidxfmwycgzcp4v2togflpqh2gnibuexjy4m4qqwxp7nh3jx5zlh4y.ipfs.dweb.link/1.json',
  'https://bridge.api.cx.metamask.io/getTokens?chainId=1',
  'https://cdn.contentful.com/spaces/jdkgyfmyd9sw/environments/master/entries?content_type=productAnnouncement&order=-sys.createdAt&fields.clients=portfolio',
  'https://cdn.segment.com/analytics-next/bundles/ajs-destination.bundle.ed53a26b6edc80c65d73.js',
  'https://cdn.segment.com/analytics-next/bundles/schemaFilter.bundle.5c2661f67b4b71a6d9bd.js',
  'https://cdn.segment.com/analytics.js/v1/2f64suG6gtrhDVI2rGCUgH9hbfp4NJ12/analytics.min.js',
  'https://cdn.segment.com/analytics.js/v1/MHae0tTVRqyHDim9qQ9ablSZpvm3Tvzc/analytics.min.js',
  'https://cdn.segment.com/v1/projects/2f64suG6gtrhDVI2rGCUgH9hbfp4NJ12/settings',
  'https://cdn.segment.com/v1/projects/MHae0tTVRqyHDim9qQ9ablSZpvm3Tvzc/settings',
  'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.14.1/css/mdb.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css',
  'https://client-config.api.cx.metamask.io/v1/flags?client=extension&distribution=flask&environment=dev',
  'https://d6tizftlrpuof.cloudfront.net/themes/production/consensys-button-8ad6c4bb549247e0276dd160e2d8e00d.png',
  'https://doesntexist.test/customRPC',
  'https://etherscan.io/favicon.ico',
  'https://execution.metamask.io/iframe/7.2.0/index.html',
  'https://execution.metamask.io/iframe/7.2.0/bundle.js',
  'https://gas.api.cx.metamask.io/networks/1/gasPrices',
  'https://gas.api.cx.metamask.io/networks/1/suggestedGasFees',
  'https://gas.api.cx.metamask.io/networks/1337/suggestedGasFees',
  'https://github.com/favicon.ico',
  'https://lattice.gridplus.io/?keyring=MetaMask&forceLogin=true',
  'https://metamask.github.io/eth-ledger-bridge-keyring',
  'https://metamask.github.io/eth-ledger-bridge-keyring/',
  'https://metamask.github.io/eth-ledger-bridge-keyring/bundle.js',
  'https://metamask.github.io/favicon.ico',
  'https://metamask.github.io/ledger-iframe-bridge/8.0.3/',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/72585f70-0b8c9d47690d7fe2ac87.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/app-acf97414441c8da8c710.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/component---src-pages-index-tsx-5cfb3411e9d4665335b8.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/f36c6662-e3e593644ccdf91e0df1.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/framework-7f36badc7ddb1e3597e8.js',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/page-data/500.html/page-data.json',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/page-data/app-data.json',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/page-data/index/page-data.json',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/static/webfonts/EuclidCircularB-Bold.woff2',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/static/webfonts/EuclidCircularB-Medium.woff2',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/static/webfonts/EuclidCircularB-Regular.woff2',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/static/webfonts/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2',
  'https://metamask.github.io/snap-account-abstraction-keyring/0.4.1/webpack-runtime-aa57915fb3e4eb554525.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/',
  'https://metamask.github.io/snap-simple-keyring/1.1.6/',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/72585f70-b0685205a809efe121dc.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/app-5331ee4ad1d5e0ac8d54.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/component---src-pages-index-tsx-1a885d3a2aa4b3b7a091.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/f36c6662-7e78236bba23a76b6101.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/favicon-32x32.png?v=96ce3237722cfe869f93249367a3fca1',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/favicon.svg?v=96ce3237722cfe869f93249367a3fca1',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/framework-fe667a09be4a08a9b5f4.js',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/page-data/app-data.json',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/page-data/index/page-data.json',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/EuclidCircularB-Bold.woff2',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/EuclidCircularB-Medium.woff2',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/EuclidCircularB-Regular.woff2',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW-.woff',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/static/webfonts/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2',
  'https://metamask.github.io/snap-simple-keyring/1.1.2/webpack-runtime-35853b86ee7228936852.js',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/assets/apple-touch-icon-1024x1024.png',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/assets/favicon-16x16.png',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/assets/favicon.ico',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/main.js',
  'https://metamask.github.io/snaps/test-snaps/2.12.0/test-data.json',
  'https://metamask.github.io/snaps/test-snaps/2.20.1',
  'https://metamask.github.io/test-dapp/metamask-fox.svg',
  'https://metamask-sdk.api.cx.metamask.io/evt',
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ANTANI',
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=PHP,USD',
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
  'https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD',
  'https://min-api.cryptocompare.com/data/price?fsym=TEST&tsyms=USD',
  'https://min-api.cryptocompare.com/data/pricemulti?fsyms=btc%2Csol&tsyms=usd',
  'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH%2CMegaETH%2CTEST&tsyms=usd',
  'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH%2CMegaETH%2CMATIC&tsyms=usd',
  'https://nft.api.cx.metamask.io/collections?contract=0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85&chainId=1',
  'https://nft.api.cx.metamask.io/collections?chainId=0x1&contract=0x0000000000000000000000000000000000000002',
  'https://nft.api.cx.metamask.io/collections?chainId=0x539&contract=0x581c3c1a2a4ebde2a0df29b5cf4c116e42945947',
  'https://nft.api.cx.metamask.io/collections?chainId=0x539&contract=0x5fbdb2315678afecb367f032d93f642f64180aa3',
  'https://nft.api.cx.metamask.io/users/0x5cfe73b6021e818b776b421b1c4db2474086a7e1/tokens?chainIds=1&limit=50&includeTopBid=true&continuation=',
  'https://o1377931.ingest.sentry.io/api/6689755/envelope/?sentry_key=be397d53390141cda058e18f3749c8e4&sentry_version=7&sentry_client=sentry.javascript.react%2F7.102.1',
  'https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/master/src/config.json',
  'https://responsive-rpc.test/',
  'https://security-alerts.api.cx.metamask.io/validate/0x1',
  'https://security-alerts.api.cx.metamask.io/validate/0x3e8',
  'https://security-alerts.api.cx.metamask.io/validate/0x53a',
  'https://signature-insights.api.cx.metamask.io/v1/signature?chainId=0x1',
  'https://signature-insights.api.cx.metamask.io/v1/signature?chainId=0x539',
  'https://sourcify.dev/server/files/any/1337/0x',
  'https://staking.api.cx.metamask.io/v1/pooled-staking/eligibility?addresses=',
  'https://swap.api.cx.metamask.io/networks/1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0x6b175474e89094c44da98b954eedeac495271d0f&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=1000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0x6b175474e89094c44da98b954eedeac495271d0f&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=2000000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0x6b175474e89094c44da98b954eedeac495271d0f&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=3000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=1000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.api.cx.metamask.io/networks/1/trades?destinationToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&sourceToken=0x0000000000000000000000000000000000000000&sourceAmount=50000000000000000000&slippage=2&timeout=10000&walletAddress=0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
  'https://swap.metaswap.codefi.network/networks/1/topAssets',
  'https://tokens.api.cx.metamask.io/v3/assets?assetIds=solana%3A5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp%2Fslip44%3A501',
  'https://tokens.api.cx.metamask.io/v3/assets?assetIds=solana%3A5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp%2Fslip44%3A501%2Csolana%3A5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp%2Ftoken%3A2RBko3xoz56aH69isQMUpzZd9NYHahhwC23A5F3Spkin',
  'https://tokens.api.cx.metamask.io/v3/assets?assetIds=solana%3AEtWTRABZaYq6iMfeYKouRu166VU2xqa1%2Fslip44%3A501',
  'https://tx-sentinel-ethereum-mainnet.api.cx.metamask.io/',
  'https://tx-sentinel-ethereum-mainnet.api.cx.metamask.io/networks',
  'https://unresponsive-rpc.test/',
  'https://verify.walletconnect.com/e6360eaee594162688065f1c70c863b7',
  'https://w.usabilla.com/ade130c1096e.js?lv=1',
  'https://websites.cdn.getfeedback.com/embed/aaeNy60jTL/gf.js',
];

const ALLOWLISTED_HOSTS = [
  'accounts.api.cx.metamask.io',
  'app.launchdarkly.com',
  'api.web3modal.com',
  'cdn.mozilla.net',
  'clientstream.launchdarkly.com',
  'content-autofill.googleapis.com',
  'events.launchdarkly.com',
  'firefox.settings.services.mozilla.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'metamask.github.io',
  'gvt1.com',
  'portfolio.metamask.io',
  'price.api.cx.metamask.io',
  'registry.npmjs.org',
  'sentry.io',
  'solana-devnet.infura.io',
  'solana-mainnet.infura.io',
  'snaps.metamask.io',
  'shavar.services.mozilla.com',
  'start.metamask.io',
  'token.api.cx.metamask.io',
  'widget.intercom.io',
];

module.exports = { ALLOWLISTED_HOSTS, ALLOWLISTED_URLS };
