import type { Connector } from '@web3-react/types';
import type { Web3ReactHooks } from '@web3-react/core';
import { createMetamaskConnector } from './connectors/metaMask';
import { createWalletConnectConnector } from './connectors/walletConnect';
import { createTallyHoConnector } from './connectors/tallyho';
import { walletIcons } from './walletIcons';

export interface Wallet {
  name: string;
  icon: string;
  checkProviderIdentity: (helpers: {
    provider: any;
    // device: Device;
  }) => boolean;
  web3react: {
    connector: Connector;
    hooks: Web3ReactHooks;
  };
  platforms: string[];
}

export enum ProviderIdentityFlag {
  AlphaWallet = 'isAlphaWallet',
  AToken = 'isAToken',
  BlockWallet = 'isBlockWallet',
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
  checkProviderIdentity: ({ provider }) =>
    // Removed for now to allow all kinds of injected wallets to connect using the metamask button as fallback
    // !!provider && !!provider[ProviderIdentityFlag.MetaMask],
    true,
  icon: walletIcons.metamask,
  platforms: ['all'],
  web3react: createMetamaskConnector(),
};

const walletConnect: Wallet = {
  name: 'Wallet Connect',
  checkProviderIdentity: ({ provider }) => true,
  icon: walletIcons.walletConnect,
  platforms: ['all'],
  web3react: createWalletConnectConnector(),
};

const brave: Wallet = {
  name: 'Brave',
  checkProviderIdentity: ({ provider }) =>
    // eslint-disable-next-line no-underscore-dangle
    (navigator as any).brave && provider?._web3Ref,
  icon: walletIcons.brave,
  platforms: ['all'],
  web3react: createMetamaskConnector(),
};

const mathWallet: Wallet = {
  name: 'MathWallet',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.MathWallet],
  icon: walletIcons.mathwallet,
  platforms: ['all'],
  web3react: createMetamaskConnector(),
};

const tallyho: Wallet = {
  name: 'Tally Ho',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.TallyHo],
  icon: walletIcons.tallyho,

  platforms: ['desktop'],
  web3react: createTallyHoConnector(),
};

const blockWallet: Wallet = {
  name: 'BlockWallet',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.BlockWallet],
  icon: walletIcons.blockwallet,

  platforms: ['desktop'],
  web3react: createMetamaskConnector(),
};

const binance: Wallet = {
  name: 'Binance',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Binance],
  icon: walletIcons.binance,

  platforms: ['desktop'],
  web3react: createMetamaskConnector(),
};

const coinbase: Wallet = {
  name: 'Coinbase',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Coinbase] ||
    provider?.providers?.[0]?.[ProviderIdentityFlag.CoinbaseExtension],
  icon: walletIcons.coinbase,

  platforms: ['all'],
  web3react: createMetamaskConnector(),
};

const detected: Wallet = {
  name: 'Detected',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Detected],
  icon: walletIcons.detected,
  platforms: ['all'],
  web3react: createMetamaskConnector(),
};

const trust: Wallet = {
  name: 'Trust',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Trust] &&
    !provider[ProviderIdentityFlag.TokenPocket],
  icon: walletIcons.trust,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const status: Wallet = {
  name: 'Status',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Status],
  icon: walletIcons.status,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const alphawallet: Wallet = {
  name: 'AlphaWallet',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.AlphaWallet],
  icon: walletIcons.alphawallet,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const atoken: Wallet = {
  name: 'AToken',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.AToken],
  icon: walletIcons.atoken,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const bitpie: Wallet = {
  name: 'Bitpie',
  checkProviderIdentity: () => (window as any).Bitpie,
  icon: walletIcons.bitpie,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const blankwallet: Wallet = {
  name: 'BlankWallet',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.BlankWallet],
  icon: walletIcons.blankwallet,
  platforms: ['desktop'],
  web3react: createMetamaskConnector(),
};

const dcent: Wallet = {
  name: 'Dcent',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Dcent],
  icon: walletIcons.dcent,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const frame: Wallet = {
  name: 'Frame',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Frame],
  icon: walletIcons.frame,
  platforms: ['desktop'],
  web3react: createMetamaskConnector(),
};

const huobiwallet: Wallet = {
  name: 'HuobiWallet',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.HuobiWallet],
  icon: walletIcons.huobiwallet,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const hyperpay: Wallet = {
  name: 'HyperPay',
  // Note: The property `hiWallet` is as of now the only known way of identifying hyperpay
  // wallet as it is a direct clone of metamask. `checkProviderIdentity` implementation is subject to
  // future changes
  checkProviderIdentity: () => (window as any).hiWallet,
  icon: walletIcons.hyperpay,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const imtoken: Wallet = {
  name: 'ImToken',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.ImToken],
  icon: walletIcons.imtoken,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const liquality: Wallet = {
  name: 'Liquality',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Liquality],
  icon: walletIcons.liquality,
  platforms: ['desktop'],
  web3react: createMetamaskConnector(),
};

const meetone: Wallet = {
  name: 'MeetOne',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.MeetOne] === 'MEETONE',
  icon: walletIcons.meetone,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const mykey: Wallet = {
  name: 'MyKey',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.MyKey],
  icon: walletIcons.mykey,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const ownbit: Wallet = {
  name: 'OwnBit',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.OwnBit],
  icon: walletIcons.ownbit,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const tokenpocket: Wallet = {
  name: 'TokenPocket',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.TokenPocket] &&
    !provider[ProviderIdentityFlag.TP],
  icon: walletIcons.tokenpocket,
  platforms: ['all'],
  web3react: createMetamaskConnector(),
};

const tp: Wallet = {
  name: 'TP',
  checkProviderIdentity: ({ provider }) => provider?.[ProviderIdentityFlag.TP],
  icon: walletIcons.tp,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const xdefi: Wallet = {
  name: 'XDEFI',
  // eslint-disable-next-line dot-notation
  checkProviderIdentity: ({ provider }) => true,
  icon: walletIcons.xdefi,
  platforms: ['all'],
  web3react: createMetamaskConnector(),
};

const oneInch: Wallet = {
  name: 'OneInch',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.OneInch],
  icon: walletIcons.oneInch,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
};

const tokenary: Wallet = {
  name: 'Tokenary',
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Tokenary],
  icon: walletIcons.tokenary,
  platforms: ['mobile'],
  web3react: createMetamaskConnector(),
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
