import { Connector } from '@web3-react/types';
import { walletIcons } from './walletIcons';
import { metaMask } from './connectors/metaMask';
// import { walletConnect } from './connectors/walletConnect';

export interface Wallet {
  name: string;
  icon: string;
  connector: Connector;
  checkProviderIdentity: (helpers: {
    provider: any;
    // device: Device;
  }) => boolean;
  platforms: string[];
}

enum ProviderIdentityFlag {
  AlphaWallet = 'isAlphaWallet',
  AToken = 'isAToken',
  Binance = 'bbcSignTx',
  Bitpie = 'isBitpie',
  BlankWallet = 'isBlank',
  Coinbase = 'isToshi',
  CoinbaseExtension = 'isCoinbaseWallet',
  Detected = 'request',
  Dcent = 'isDcentWallet',
  Frame = 'isFrame',
  HuobiWallet = 'isHbWallet',
  HyperPay = 'isHyperPay',
  ImToken = 'isImToken',
  Liquality = 'isLiquality',
  MeetOne = 'wallet',
  MetaMask = 'isMetaMask',
  MyKey = 'isMYKEY',
  OwnBit = 'isOwnbit',
  Status = 'isStatus',
  Trust = 'isTrust',
  TokenPocket = 'isTokenPocket',
  TP = 'isTp',
  WalletIo = 'isWalletIO',
  XDEFI = 'isXDEFI',
  OneInch = 'isOneInchIOSWallet',
  Tokenary = 'isTokenary',
  MathWallet = 'isMathWallet',
}
const metamask: Wallet = {
  name: 'MetaMask',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.MetaMask],
  icon: walletIcons.metamask,
  connector: metaMask,
  platforms: ['all'],
};

const brave: Wallet = {
  name: 'Brave',
  checkProviderIdentity: ({ provider }) =>
    // eslint-disable-next-line no-underscore-dangle
    !!(navigator as any).brave && !!provider && !!provider._web3Ref,
  icon: walletIcons.brave,
  connector: metaMask,

  platforms: ['all'],
};

const mathWallet: Wallet = {
  name: 'MathWallet',
  checkProviderIdentity: ({ provider }) =>
    // eslint-disable-next-line no-underscore-dangle
    !!provider && !!provider[ProviderIdentityFlag.MathWallet],
  icon: walletIcons.mathwallet,
  connector: metaMask,

  platforms: ['all'],
};

const binance: Wallet = {
  name: 'Binance',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.Binance],
  icon: walletIcons.binance,
  connector: metaMask,

  platforms: ['desktop'],
};

const coinbase: Wallet = {
  name: 'Coinbase',
  checkProviderIdentity: ({ provider }) =>
    (!!provider && !!provider[ProviderIdentityFlag.Coinbase]) ||
    (!!provider &&
      !!provider.providers &&
      !!provider.providers[0] &&
      !!provider.providers[0][ProviderIdentityFlag.CoinbaseExtension]),
  icon: walletIcons.coinbase,
  connector: metaMask,

  platforms: ['all'],
};

const detected: Wallet = {
  name: 'Detected',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.Detected],
  icon: walletIcons.detected,
  connector: metaMask,
  platforms: ['all'],
};

const trust: Wallet = {
  name: 'Trust',
  checkProviderIdentity: ({ provider }) =>
    !!provider &&
    !!provider[ProviderIdentityFlag.Trust] &&
    !!provider &&
    !provider[ProviderIdentityFlag.TokenPocket],

  icon: walletIcons.trust,
  connector: metaMask,

  platforms: ['mobile'],
};

// const opera: Wallet = {
//   name: 'Opera',
//   checkProviderIdentity: ({ device }) => device.browser.name === 'Opera',
//   icon: async () => (await import('./walletIcons/opera.svg')).default,
//   connector: async () => ({
//     provider: createEIP1193Provider(window.ethereum, {
//       eth_requestAccounts: async ({ baseRequest }) =>
//         baseRequest({ method: 'eth_accounts' }),
//       eth_selectAccounts: UNSUPPORTED_METHOD,
//     }),
//   }),
//   platforms: ['all'],
// };

const status: Wallet = {
  name: 'Status',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.Status],
  icon: walletIcons.status,
  connector: metaMask,
  platforms: ['mobile'],
};

const alphawallet: Wallet = {
  name: 'AlphaWallet',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.AlphaWallet],
  icon: walletIcons.alphawallet,
  connector: metaMask,
  platforms: ['mobile'],
};

const atoken: Wallet = {
  name: 'AToken',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.AToken],
  icon: walletIcons.atoken,
  connector: metaMask,
  platforms: ['mobile'],
};

const bitpie: Wallet = {
  name: 'Bitpie',
  checkProviderIdentity: () => !!(window as any).Bitpie,
  icon: walletIcons.bitpie,
  connector: metaMask,
  platforms: ['mobile'],
};

const blankwallet: Wallet = {
  name: 'BlankWallet',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.BlankWallet],
  icon: walletIcons.blankwallet,
  connector: metaMask,
  platforms: ['desktop'],
};

const dcent: Wallet = {
  name: 'Dcent',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.Dcent],
  icon: walletIcons.dcent,
  connector: metaMask,
  platforms: ['mobile'],
};

const frame: Wallet = {
  name: 'Frame',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.Frame],
  icon: walletIcons.frame,
  connector: metaMask,
  platforms: ['desktop'],
};

const huobiwallet: Wallet = {
  name: 'HuobiWallet',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.HuobiWallet],
  icon: walletIcons.huobiwallet,
  connector: metaMask,
  platforms: ['mobile'],
};

const hyperpay: Wallet = {
  name: 'HyperPay',
  // Note: The property `hiWallet` is as of now the only known way of identifying hyperpay
  // wallet as it is a direct clone of metamask. `checkProviderIdentity` implementation is subject to
  // future changes
  checkProviderIdentity: () => !!(window as any).hiWallet,
  icon: walletIcons.hyperpay,
  connector: metaMask,
  platforms: ['mobile'],
};

const imtoken: Wallet = {
  name: 'ImToken',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.ImToken],
  icon: walletIcons.imtoken,
  connector: metaMask,
  platforms: ['mobile'],
};

const liquality: Wallet = {
  name: 'Liquality',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.Liquality],
  icon: walletIcons.liquality,
  connector: metaMask,
  platforms: ['desktop'],
};

const meetone: Wallet = {
  name: 'MeetOne',
  checkProviderIdentity: ({ provider }) =>
    !!provider && provider[ProviderIdentityFlag.MeetOne] === 'MEETONE',
  icon: walletIcons.meetone,
  connector: metaMask,
  platforms: ['mobile'],
};

const mykey: Wallet = {
  name: 'MyKey',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.MyKey],
  icon: walletIcons.mykey,
  connector: metaMask,
  platforms: ['mobile'],
};

const ownbit: Wallet = {
  name: 'OwnBit',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.OwnBit],
  icon: walletIcons.ownbit,
  connector: metaMask,
  platforms: ['mobile'],
};

const tokenpocket: Wallet = {
  name: 'TokenPocket',
  checkProviderIdentity: ({ provider }) =>
    !!provider &&
    !!provider[ProviderIdentityFlag.TokenPocket] &&
    !provider[ProviderIdentityFlag.TP],
  icon: walletIcons.tokenpocket,
  connector: metaMask,
  platforms: ['all'],
};

const tp: Wallet = {
  name: 'TP',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.TP],
  icon: walletIcons.tp,
  connector: metaMask,
  platforms: ['mobile'],
};

const xdefi: Wallet = {
  name: 'XDEFI',
  checkProviderIdentity: ({ provider }) =>
    provider &&
    provider.ethereum &&
    provider.ethereum[ProviderIdentityFlag.XDEFI],
  icon: walletIcons.xdefi,
  connector: metaMask,
  platforms: ['all'],
};

const oneInch: Wallet = {
  name: 'OneInch',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.OneInch],
  icon: walletIcons.oneInch,
  connector: metaMask,
  platforms: ['mobile'],
};

const tokenary: Wallet = {
  name: 'Tokenary',
  checkProviderIdentity: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.Tokenary],
  icon: walletIcons.tokenary,
  connector: metaMask,
  platforms: ['mobile'],
};

export const supportedWallets = [
  metamask,
  binance,
  coinbase,
  detected,
  trust,
  //   opera,
  status,
  alphawallet,
  atoken,
  bitpie,
  blankwallet,
  brave,
  dcent,
  frame,
  huobiwallet,
  hyperpay,
  imtoken,
  liquality,
  meetone,
  mykey,
  ownbit,
  tokenpocket,
  tp,
  xdefi,
  oneInch,
  tokenary,
  mathWallet,
];
