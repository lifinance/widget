import type { Connector } from '@web3-react/types';
import { metaMask } from './connectors/metaMask';
import { wallets } from './wallets';
import { walletConnect as walletConnectConnector } from './connectors/walletConnect';

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
  XDEFI = 'isXDEFI',
  OneInch = 'isOneInchIOSWallet',
  Tokenary = 'isTokenary',
  MathWallet = 'isMathWallet',
}

const metamask: Wallet = {
  name: wallets.metamask.name,
  checkProviderIdentity: ({ provider }) =>
    // Removed for now to allow all kinds of injected wallets to connect using the metamask button as fallback
    // !!provider && !!provider[ProviderIdentityFlag.MetaMask],
    true,
  icon: wallets.metamask.icon,
  connector: metaMask,
  platforms: ['all'],
};

const walletConnect: Wallet = {
  name: wallets.walletConnect.name,
  checkProviderIdentity: ({ provider }) => true,
  icon: wallets.walletConnect.icon,
  connector: walletConnectConnector,
  platforms: ['all'],
};

const brave: Wallet = {
  name: wallets.brave.name,
  checkProviderIdentity: ({ provider }) =>
    // eslint-disable-next-line no-underscore-dangle
    (navigator as any).brave && provider?._web3Ref,
  icon: wallets.brave.icon,
  connector: metaMask,

  platforms: ['all'],
};

const mathWallet: Wallet = {
  name: wallets.mathwallet.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.MathWallet],
  icon: wallets.mathwallet.icon,
  connector: metaMask,

  platforms: ['all'],
};

const tallyho: Wallet = {
  name: wallets.tallyho.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.TallyHo],
  icon: wallets.tallyho.icon,
  connector: metaMask,

  platforms: ['desktop'],
};

const blockWallet: Wallet = {
  name: wallets.blockwallet.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.BlockWallet],
  icon: wallets.blockwallet.icon,
  connector: metaMask,

  platforms: ['desktop'],
};

const binance: Wallet = {
  name: wallets.binance.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Binance],
  icon: wallets.binance.icon,
  connector: metaMask,

  platforms: ['desktop'],
};

const coinbase: Wallet = {
  name: wallets.coinbase.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Coinbase] ||
    provider?.providers?.[0]?.[ProviderIdentityFlag.CoinbaseExtension],
  icon: wallets.coinbase.icon,
  connector: metaMask,

  platforms: ['all'],
};

const detected: Wallet = {
  name: wallets.detected.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Detected],
  icon: wallets.detected.icon,
  connector: metaMask,
  platforms: ['all'],
};

const trust: Wallet = {
  name: wallets.trust.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Trust] &&
    !provider[ProviderIdentityFlag.TokenPocket],
  icon: wallets.trust.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const status: Wallet = {
  name: wallets.status.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Status],
  icon: wallets.status.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const alphawallet: Wallet = {
  name: wallets.alphawallet.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.AlphaWallet],
  icon: wallets.alphawallet.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const atoken: Wallet = {
  name: wallets.atoken.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.AToken],
  icon: wallets.atoken.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const bitpie: Wallet = {
  name: wallets.bitpie.name,
  checkProviderIdentity: () => (window as any).Bitpie,
  icon: wallets.bitpie.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const blankwallet: Wallet = {
  name: wallets.blankwallet.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.BlankWallet],
  icon: wallets.blankwallet.icon,
  connector: metaMask,
  platforms: ['desktop'],
};

const dcent: Wallet = {
  name: wallets.dcent.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Dcent],
  icon: wallets.dcent.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const frame: Wallet = {
  name: wallets.frame.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Frame],
  icon: wallets.frame.icon,
  connector: metaMask,
  platforms: ['desktop'],
};

const huobiwallet: Wallet = {
  name: wallets.huobiwallet.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.HuobiWallet],
  icon: wallets.huobiwallet.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const hyperpay: Wallet = {
  name: wallets.hyperpay.name,
  // Note: The property `hiWallet` is as of now the only known way of identifying hyperpay
  // wallet as it is a direct clone of metamask. `checkProviderIdentity` implementation is subject to
  // future changes
  checkProviderIdentity: () => (window as any).hiWallet,
  icon: wallets.hyperpay.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const imtoken: Wallet = {
  name: wallets.imtoken.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.ImToken],
  icon: wallets.imtoken.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const liquality: Wallet = {
  name: wallets.liquality.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Liquality],
  icon: wallets.liquality.icon,
  connector: metaMask,
  platforms: ['desktop'],
};

const meetone: Wallet = {
  name: wallets.meetone.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.MeetOne] === 'MEETONE',
  icon: wallets.meetone.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const mykey: Wallet = {
  name: wallets.mykey.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.MyKey],
  icon: wallets.mykey.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const ownbit: Wallet = {
  name: wallets.ownbit.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.OwnBit],
  icon: wallets.ownbit.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const tokenpocket: Wallet = {
  name: wallets.tokenpocket.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.TokenPocket] &&
    !provider[ProviderIdentityFlag.TP],
  icon: wallets.tokenpocket.icon,
  connector: metaMask,
  platforms: ['all'],
};

const tp: Wallet = {
  name: wallets.tp.name,
  checkProviderIdentity: ({ provider }) => provider?.[ProviderIdentityFlag.TP],
  icon: wallets.tp.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const xdefi: Wallet = {
  name: wallets.xdefi.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.ethereum?.[ProviderIdentityFlag.XDEFI],
  icon: wallets.xdefi.icon,
  connector: metaMask,
  platforms: ['all'],
};

const oneInch: Wallet = {
  name: wallets.oneInch.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.OneInch],
  icon: wallets.oneInch.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

const tokenary: Wallet = {
  name: wallets.tokenary.name,
  checkProviderIdentity: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Tokenary],
  icon: wallets.tokenary.icon,
  connector: metaMask,
  platforms: ['mobile'],
};

export const supportedWallets = [
  metamask,
  walletConnect,
  binance,
  coinbase,
  detected,
  trust,
  status,
  alphawallet,
  oneInch,
  tallyho,
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
  tokenary,
  mathWallet,
];
