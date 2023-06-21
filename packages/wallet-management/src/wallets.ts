import { supportedChains } from '@lifi/sdk';
import { InjectedConnector } from './connectors/injectedConnector';
import { WalletConnectConnector } from './connectors/walletConnectConnector';
import type { Wallet } from './types';
import { ProviderIdentityFlag } from './types';
import { walletIcons } from './walletIcons';
import { SafeWalletConnector } from './connectors/safeWalletConnector';
import SafeAppsSDK from '@safe-global/safe-apps-sdk/dist/src/sdk';

const defaultWallet: Wallet = new InjectedConnector({
  // unknown Default wallet that injects as metamask but is not metamask
  name: 'Default Wallet',
  installed: async () =>
    !!(window as any).ethereum &&
    !(window as any)?.ethereum?.[ProviderIdentityFlag.MetaMask],
  icon: walletIcons.placeholder,
});

const metamask: Wallet = new InjectedConnector({
  name: 'MetaMask',
  installed: async () =>
    !!(window as any)?.ethereum?.[ProviderIdentityFlag.MetaMask],
  icon: walletIcons.metamask,
});

const walletConnect: Wallet = new WalletConnectConnector({
  name: 'Wallet Connect',
  installed: async () => true,
  icon: walletIcons.walletConnect,
  rpc: Object.fromEntries(
    supportedChains.map((chain) => {
      return [chain.id, chain.metamask.rpcUrls[0] || ''];
    }),
  ),
});

const frontier: Wallet = new InjectedConnector(
  {
    name: 'Frontier',
    installed: async () => (window as any).frontier,
    icon: walletIcons.frontier,
  },
  (window as any).frontier?.ethereum,
);

const brave: Wallet = new InjectedConnector({
  name: 'Brave',
  installed: async () =>
    // eslint-disable-next-line no-underscore-dangle
    (navigator as any).brave && (window as any)._web3Ref,
  icon: walletIcons.brave,
});

const mathWallet: Wallet = new InjectedConnector({
  name: 'MathWallet',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.MathWallet],
  icon: walletIcons.mathwallet,
});

const tallyho: Wallet = new InjectedConnector(
  {
    name: 'Taho',
    installed: async () =>
      (window as any).tally &&
      (window as any).tally?.[ProviderIdentityFlag.TallyHo],
    icon: walletIcons.tallyho,
  },
  (window as any).tally,
);

const blockWallet: Wallet = new InjectedConnector({
  name: 'BlockWallet',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.BlockWallet],
  icon: walletIcons.blockwallet,
});

const binance: Wallet = new InjectedConnector(
  {
    name: 'Binance',
    installed: async () => (window as any).BinanceChain,
    icon: walletIcons.binance,
  },
  (window as any).BinanceChain,
);

const coinbase: Wallet = new InjectedConnector(
  {
    name: 'Coinbase',
    installed: async () => (window as any).coinbaseWalletExtension,
    icon: walletIcons.coinbase,
  },
  (window as any).coinbaseWalletExtension,
);

const trust: Wallet = new InjectedConnector(
  {
    name: 'Trust',
    installed: async () => (window as any).trustWallet,
    icon: walletIcons.trust,
  },
  (window as any).trustWallet,
);

const status: Wallet = new InjectedConnector({
  name: 'Status',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.Status],
  icon: walletIcons.status,
});

const alphawallet: Wallet = new InjectedConnector({
  name: 'AlphaWallet',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.AlphaWallet],
  icon: walletIcons.alphawallet,
});

const atoken: Wallet = new InjectedConnector({
  name: 'AToken',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.AToken],
  icon: walletIcons.atoken,
});

const apex: Wallet = new InjectedConnector({
  name: 'Apex Wallet',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.ApexWallet],
  icon: walletIcons.placeholder,
});

const bitpie: Wallet = new InjectedConnector({
  name: 'Bitpie',
  installed: async () => (window as any).ethereum?.Bitpie,
  icon: walletIcons.bitpie,
});

const dcent: Wallet = new InjectedConnector({
  name: 'Dcent',
  installed: async () => (window as any).ethereum?.[ProviderIdentityFlag.Dcent],
  icon: walletIcons.dcent,
});

const frame: Wallet = new InjectedConnector(
  {
    name: 'Frame',
    installed: async () => (window as any).frame,
    icon: walletIcons.frame,
  },
  (window as any).frame,
);

const huobiwallet: Wallet = new InjectedConnector({
  name: 'HuobiWallet',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.HuobiWallet],
  icon: walletIcons.huobiwallet,
});

const hyperpay: Wallet = new InjectedConnector({
  name: 'HyperPay',
  // Note: The property `hiWallet` is as of now the only known way of identifying hyperpay
  // wallet as it is a direct clone of metamask. `checkProviderIdentity` implementation is subject to
  // future changes
  installed: async () => (window as any).ethereum?.hiWallet,
  icon: walletIcons.hyperpay,
});

const imtoken: Wallet = new InjectedConnector({
  name: 'ImToken',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.ImToken],
  icon: walletIcons.imtoken,
});

const liquality: Wallet = new InjectedConnector(
  {
    name: 'Liquality',
    installed: async () => (window as any).liquality,
    icon: walletIcons.liquality,
  },
  (window as any).liquality,
);

const meetone: Wallet = new InjectedConnector({
  name: 'MeetOne',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.MeetOne] === 'MEETONE',
  icon: walletIcons.meetone,
});

const mykey: Wallet = new InjectedConnector({
  name: 'MyKey',
  installed: async () => (window as any).ethereum?.[ProviderIdentityFlag.MyKey],
  icon: walletIcons.mykey,
});

const ownbit: Wallet = new InjectedConnector({
  name: 'OwnBit',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.OwnBit],
  icon: walletIcons.ownbit,
});

const tokenpocket: Wallet = new InjectedConnector({
  name: 'TokenPocket',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.TokenPocket] &&
    !(window as any).ethereum?.[ProviderIdentityFlag.TP],
  icon: walletIcons.tokenpocket,
});

const xdefi: Wallet = new InjectedConnector({
  name: 'XDEFI',
  // eslint-disable-next-line dot-notation
  installed: async () => (window as any).ethereum?.[ProviderIdentityFlag.XDEFI],
  icon: walletIcons.xdefi,
});

const oneInch: Wallet = new InjectedConnector({
  name: 'OneInch',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.OneInch],
  icon: walletIcons.oneInch,
});

const tokenary: Wallet = new InjectedConnector({
  name: 'Tokenary',
  installed: async () =>
    (window as any).ethereum?.[ProviderIdentityFlag.Tokenary],
  icon: walletIcons.tokenary,
});

const exodus: Wallet = new InjectedConnector(
  {
    name: 'ERSLKDJFLKSDJf',
    installed: async () => (window as any).exodus?.ethereum,
    icon: walletIcons.exodus,
  },
  (window as any).exodus?.ethereum,
);

const safe: Wallet = new SafeWalletConnector({
  name: 'Safe',
  installed: async () => {
    const sdk = new SafeAppsSDK();

    const accountInfo = await sdk.safe.getInfo();
    return !!accountInfo.safeAddress;
  },
  icon: walletIcons.safe,
});

export const supportedWallets = [
  defaultWallet,
  metamask,
  walletConnect,
  exodus,
  tallyho,
  binance,
  frontier,
  coinbase,
  trust,
  status,
  alphawallet,
  atoken,
  blockWallet,
  bitpie,
  brave,
  apex,
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
  xdefi,
  oneInch,
  tokenary,
  mathWallet,
  safe,
];
