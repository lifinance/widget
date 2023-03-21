import { InjectedConnector } from './connectors/injectedConnector';
import { walletIcons } from './walletIcons';

export interface Wallet {
  name: string;
  icon: string;
  installed: (helpers: { provider: any }) => boolean;
  connector: InjectedConnector;
  platforms: string[];
}

export enum ProviderIdentityFlag {
  AlphaWallet = 'isAlphaWallet',
  AToken = 'isAToken',
  BlockWallet = 'isBlockWallet',
  Binance = 'bbcSignTx',
  Bitpie = 'isBitpie',
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
  TallyHo = 'isTally',
  Trust = 'isTrust',
  TokenPocket = 'isTokenPocket',
  TP = 'isTp',
  WalletIo = 'isWalletIO',
  XDEFI = '__XDEFI',
  OneInch = 'isOneInchIOSWallet',
  Tokenary = 'isTokenary',
  MathWallet = 'isMathWallet',
}

const metamask: Wallet = {
  name: 'MetaMask',
  installed: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.MetaMask],
  icon: walletIcons.metamask,
  platforms: ['all'],
  connector: new InjectedConnector(),
};

const walletConnect: Wallet = {
  name: 'Wallet Connect',
  installed: ({ provider }) => true,
  icon: walletIcons.walletConnect,
  platforms: ['all'],
  connector: new InjectedConnector(),
};

const brave: Wallet = {
  name: 'Brave',
  installed: ({ provider }) =>
    // eslint-disable-next-line no-underscore-dangle
    (navigator as any).brave && provider?._web3Ref,
  icon: walletIcons.brave,
  platforms: ['all'],
  connector: new InjectedConnector(),
};

const mathWallet: Wallet = {
  name: 'MathWallet',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.MathWallet],
  icon: walletIcons.mathwallet,
  platforms: ['all'],
  connector: new InjectedConnector(),
};

const tallyho: Wallet = {
  name: 'Tally Ho',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.TallyHo],
  icon: walletIcons.tallyho,

  platforms: ['desktop'],
  connector: new InjectedConnector(),
};

const blockWallet: Wallet = {
  name: 'BlockWallet',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.BlockWallet],
  icon: walletIcons.blockwallet,

  platforms: ['desktop'],
  connector: new InjectedConnector(),
};

const binance: Wallet = {
  name: 'Binance',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Binance],
  icon: walletIcons.binance,
  platforms: ['desktop'],
  connector: new InjectedConnector(),
};

const coinbase: Wallet = {
  name: 'Coinbase',
  installed: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Coinbase] ||
    provider?.providers?.[0]?.[ProviderIdentityFlag.CoinbaseExtension],
  icon: walletIcons.coinbase,

  platforms: ['all'],
  connector: new InjectedConnector(),
};

const detected: Wallet = {
  name: 'Detected',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Detected],
  icon: walletIcons.detected,
  platforms: ['all'],
  connector: new InjectedConnector(),
};

const trust: Wallet = {
  name: 'Trust',
  installed: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Trust] &&
    !provider[ProviderIdentityFlag.TokenPocket],
  icon: walletIcons.trust,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const status: Wallet = {
  name: 'Status',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Status],
  icon: walletIcons.status,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const alphawallet: Wallet = {
  name: 'AlphaWallet',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.AlphaWallet],
  icon: walletIcons.alphawallet,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const atoken: Wallet = {
  name: 'AToken',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.AToken],
  icon: walletIcons.atoken,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const bitpie: Wallet = {
  name: 'Bitpie',
  installed: () => (window as any).Bitpie,
  icon: walletIcons.bitpie,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const dcent: Wallet = {
  name: 'Dcent',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Dcent],
  icon: walletIcons.dcent,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const frame: Wallet = {
  name: 'Frame',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Frame],
  icon: walletIcons.frame,
  platforms: ['desktop'],
  connector: new InjectedConnector(),
};

const huobiwallet: Wallet = {
  name: 'HuobiWallet',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.HuobiWallet],
  icon: walletIcons.huobiwallet,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const hyperpay: Wallet = {
  name: 'HyperPay',
  // Note: The property `hiWallet` is as of now the only known way of identifying hyperpay
  // wallet as it is a direct clone of metamask. `checkProviderIdentity` implementation is subject to
  // future changes
  installed: () => (window as any).hiWallet,
  icon: walletIcons.hyperpay,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const imtoken: Wallet = {
  name: 'ImToken',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.ImToken],
  icon: walletIcons.imtoken,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const liquality: Wallet = {
  name: 'Liquality',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Liquality],
  icon: walletIcons.liquality,
  platforms: ['desktop'],
  connector: new InjectedConnector(),
};

const meetone: Wallet = {
  name: 'MeetOne',
  installed: ({ provider }) =>
    provider?.[ProviderIdentityFlag.MeetOne] === 'MEETONE',
  icon: walletIcons.meetone,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const mykey: Wallet = {
  name: 'MyKey',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.MyKey],
  icon: walletIcons.mykey,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const ownbit: Wallet = {
  name: 'OwnBit',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.OwnBit],
  icon: walletIcons.ownbit,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const tokenpocket: Wallet = {
  name: 'TokenPocket',
  installed: ({ provider }) =>
    provider?.[ProviderIdentityFlag.TokenPocket] &&
    !provider[ProviderIdentityFlag.TP],
  icon: walletIcons.tokenpocket,
  platforms: ['all'],
  connector: new InjectedConnector(),
};

const tp: Wallet = {
  name: 'TP',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.TP],
  icon: walletIcons.tp,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const xdefi: Wallet = {
  name: 'XDEFI',
  // eslint-disable-next-line dot-notation
  installed: ({ provider }) => true,
  icon: walletIcons.xdefi,
  platforms: ['all'],
  connector: new InjectedConnector(),
};

const oneInch: Wallet = {
  name: 'OneInch',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.OneInch],
  icon: walletIcons.oneInch,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

const tokenary: Wallet = {
  name: 'Tokenary',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Tokenary],
  icon: walletIcons.tokenary,
  platforms: ['mobile'],
  connector: new InjectedConnector(),
};

export const supportedWallets = [
  metamask,
  walletConnect,
  tallyho,
  binance,
  coinbase,
  detected,
  trust,
  status,
  alphawallet,
  atoken,
  blockWallet,
  bitpie,
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
