import { InjectedConnector } from './connectors/injectedConnector';
import type { Wallet } from './types';
import { ProviderIdentityFlag } from './types';
import { walletIcons } from './walletIcons';
import { WalletConnectConnector } from './connectors/walletConnectConnector';
import { supportedChains } from '@lifi/sdk';

const metamask: Wallet = new InjectedConnector({
  name: 'MetaMask',
  installed: () =>
    !!(window as any) && !!(window as any)[ProviderIdentityFlag.MetaMask],
  icon: walletIcons.metamask,
});

const walletConnect: Wallet = new WalletConnectConnector({
  name: 'Wallet Connect',
  installed: () => true,
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
    installed: () => (window as any).frontier,
    icon: walletIcons.frontier,
  },
  (window as any).frontier.ethereum,
);

const brave: Wallet = new InjectedConnector({
  name: 'Brave',
  installed: () =>
    // eslint-disable-next-line no-underscore-dangle
    (navigator as any).brave && (window as any)._web3Ref,
  icon: walletIcons.brave,
});

const mathWallet: Wallet = new InjectedConnector({
  name: 'MathWallet',
  installed: () => (window as any)[ProviderIdentityFlag.MathWallet],
  icon: walletIcons.mathwallet,
});

const tallyho: Wallet = new InjectedConnector(
  {
    name: 'Tally Ho',
    installed: () =>
      (window as any).tally &&
      (window as any).tally[ProviderIdentityFlag.TallyHo],
    icon: walletIcons.tallyho,
  },
  (window as any).tally,
);

const blockWallet: Wallet = new InjectedConnector({
  name: 'BlockWallet',
  installed: () => (window as any)[ProviderIdentityFlag.BlockWallet],
  icon: walletIcons.blockwallet,
});

const binance: Wallet = new InjectedConnector({
  name: 'Binance',
  installed: () => (window as any)[ProviderIdentityFlag.Binance],
  icon: walletIcons.binance,
});

const coinbase: Wallet = new InjectedConnector({
  name: 'Coinbase',
  installed: () =>
    (window as any)[ProviderIdentityFlag.Coinbase] ||
    (window as any).providers?.[0]?.[ProviderIdentityFlag.CoinbaseExtension],
  icon: walletIcons.coinbase,
});

const detected: Wallet = new InjectedConnector({
  name: 'Detected',
  installed: () => (window as any)[ProviderIdentityFlag.Detected],
  icon: walletIcons.detected,
});

const trust: Wallet = new InjectedConnector({
  name: 'Trust',
  installed: () =>
    (window as any)[ProviderIdentityFlag.Trust] &&
    !(window as any)[ProviderIdentityFlag.TokenPocket],
  icon: walletIcons.trust,
});

const status: Wallet = new InjectedConnector({
  name: 'Status',
  installed: () => (window as any)[ProviderIdentityFlag.Status],
  icon: walletIcons.status,
});

const alphawallet: Wallet = new InjectedConnector({
  name: 'AlphaWallet',
  installed: () => (window as any)[ProviderIdentityFlag.AlphaWallet],
  icon: walletIcons.alphawallet,
});

const atoken: Wallet = new InjectedConnector({
  name: 'AToken',
  installed: () => (window as any)[ProviderIdentityFlag.AToken],
  icon: walletIcons.atoken,
});

const bitpie: Wallet = new InjectedConnector({
  name: 'Bitpie',
  installed: () => (window as any).Bitpie,
  icon: walletIcons.bitpie,
});

const dcent: Wallet = new InjectedConnector({
  name: 'Dcent',
  installed: () => (window as any)[ProviderIdentityFlag.Dcent],
  icon: walletIcons.dcent,
});

const frame: Wallet = new InjectedConnector({
  name: 'Frame',
  installed: () => (window as any)[ProviderIdentityFlag.Frame],
  icon: walletIcons.frame,
});

const huobiwallet: Wallet = new InjectedConnector({
  name: 'HuobiWallet',
  installed: () => (window as any)[ProviderIdentityFlag.HuobiWallet],
  icon: walletIcons.huobiwallet,
});

const hyperpay: Wallet = new InjectedConnector({
  name: 'HyperPay',
  // Note: The property `hiWallet` is as of now the only known way of identifying hyperpay
  // wallet as it is a direct clone of metamask. `checkProviderIdentity` implementation is subject to
  // future changes
  installed: () => (window as any).hiWallet,
  icon: walletIcons.hyperpay,
});

const imtoken: Wallet = new InjectedConnector({
  name: 'ImToken',
  installed: () => (window as any)[ProviderIdentityFlag.ImToken],
  icon: walletIcons.imtoken,
});

const liquality: Wallet = new InjectedConnector({
  name: 'Liquality',
  installed: () => (window as any)[ProviderIdentityFlag.Liquality],
  icon: walletIcons.liquality,
});

const meetone: Wallet = new InjectedConnector({
  name: 'MeetOne',
  installed: () => (window as any)[ProviderIdentityFlag.MeetOne] === 'MEETONE',
  icon: walletIcons.meetone,
});

const mykey: Wallet = new InjectedConnector({
  name: 'MyKey',
  installed: () => (window as any)[ProviderIdentityFlag.MyKey],
  icon: walletIcons.mykey,
});

const ownbit: Wallet = new InjectedConnector({
  name: 'OwnBit',
  installed: () => (window as any)[ProviderIdentityFlag.OwnBit],
  icon: walletIcons.ownbit,
});

const tokenpocket: Wallet = new InjectedConnector({
  name: 'TokenPocket',
  installed: () =>
    (window as any)[ProviderIdentityFlag.TokenPocket] &&
    !(window as any)[ProviderIdentityFlag.TP],
  icon: walletIcons.tokenpocket,
});

const tp: Wallet = new InjectedConnector({
  name: 'TP',
  installed: () => (window as any)[ProviderIdentityFlag.TP],
  icon: walletIcons.tp,
});

const xdefi: Wallet = new InjectedConnector({
  name: 'XDEFI',
  // eslint-disable-next-line dot-notation
  installed: () => true,
  icon: walletIcons.xdefi,
});

const oneInch: Wallet = new InjectedConnector({
  name: 'OneInch',
  installed: () => (window as any)[ProviderIdentityFlag.OneInch],
  icon: walletIcons.oneInch,
});

const tokenary: Wallet = new InjectedConnector({
  name: 'Tokenary',
  installed: () => (window as any)[ProviderIdentityFlag.Tokenary],
  icon: walletIcons.tokenary,
});

export const supportedWallets = [
  metamask,
  walletConnect,
  tallyho,
  binance,
  frontier,
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
