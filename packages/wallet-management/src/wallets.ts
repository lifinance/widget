import { InjectedConnector } from './connectors/injectedConnector';
import type { Wallet } from './types';
import { ProviderIdentityFlag } from './types';
import { walletIcons } from './walletIcons';
import { WalletConnectConnector } from './connectors/walletConnectConnector';
import { supportedChains } from '@lifi/sdk';

const metamask: Wallet = new InjectedConnector({
  name: 'MetaMask',
  installed: ({ provider }) =>
    !!provider && !!provider[ProviderIdentityFlag.MetaMask],
  icon: walletIcons.metamask,
});

const walletConnect: Wallet = new WalletConnectConnector({
  name: 'Wallet Connect',
  installed: ({ provider }) => true,
  icon: walletIcons.walletConnect,
  rpc: Object.fromEntries(
    supportedChains.map((chain) => {
      return [chain.id, chain.metamask.rpcUrls[0] || ''];
    }),
  ),
});

const brave: Wallet = new InjectedConnector({
  name: 'Brave',
  installed: ({ provider }) =>
    // eslint-disable-next-line no-underscore-dangle
    (navigator as any).brave && provider?._web3Ref,
  icon: walletIcons.brave,
});

const mathWallet: Wallet = new InjectedConnector({
  name: 'MathWallet',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.MathWallet],
  icon: walletIcons.mathwallet,
});

const tallyho: Wallet = new InjectedConnector({
  name: 'Tally Ho',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.TallyHo],
  icon: walletIcons.tallyho,
});

const blockWallet: Wallet = new InjectedConnector({
  name: 'BlockWallet',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.BlockWallet],
  icon: walletIcons.blockwallet,
});

const binance: Wallet = new InjectedConnector({
  name: 'Binance',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Binance],
  icon: walletIcons.binance,
});

const coinbase: Wallet = new InjectedConnector({
  name: 'Coinbase',
  installed: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Coinbase] ||
    provider?.providers?.[0]?.[ProviderIdentityFlag.CoinbaseExtension],
  icon: walletIcons.coinbase,
});

const detected: Wallet = new InjectedConnector({
  name: 'Detected',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Detected],
  icon: walletIcons.detected,
});

const trust: Wallet = new InjectedConnector({
  name: 'Trust',
  installed: ({ provider }) =>
    provider?.[ProviderIdentityFlag.Trust] &&
    !provider[ProviderIdentityFlag.TokenPocket],
  icon: walletIcons.trust,
});

const status: Wallet = new InjectedConnector({
  name: 'Status',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Status],
  icon: walletIcons.status,
});

const alphawallet: Wallet = new InjectedConnector({
  name: 'AlphaWallet',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.AlphaWallet],
  icon: walletIcons.alphawallet,
});

const atoken: Wallet = new InjectedConnector({
  name: 'AToken',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.AToken],
  icon: walletIcons.atoken,
});

const bitpie: Wallet = new InjectedConnector({
  name: 'Bitpie',
  installed: () => (window as any).Bitpie,
  icon: walletIcons.bitpie,
});

const dcent: Wallet = new InjectedConnector({
  name: 'Dcent',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Dcent],
  icon: walletIcons.dcent,
});

const frame: Wallet = new InjectedConnector({
  name: 'Frame',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Frame],
  icon: walletIcons.frame,
});

const huobiwallet: Wallet = new InjectedConnector({
  name: 'HuobiWallet',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.HuobiWallet],
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
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.ImToken],
  icon: walletIcons.imtoken,
});

const liquality: Wallet = new InjectedConnector({
  name: 'Liquality',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Liquality],
  icon: walletIcons.liquality,
});

const meetone: Wallet = new InjectedConnector({
  name: 'MeetOne',
  installed: ({ provider }) =>
    provider?.[ProviderIdentityFlag.MeetOne] === 'MEETONE',
  icon: walletIcons.meetone,
});

const mykey: Wallet = new InjectedConnector({
  name: 'MyKey',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.MyKey],
  icon: walletIcons.mykey,
});

const ownbit: Wallet = new InjectedConnector({
  name: 'OwnBit',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.OwnBit],
  icon: walletIcons.ownbit,
});

const tokenpocket: Wallet = new InjectedConnector({
  name: 'TokenPocket',
  installed: ({ provider }) =>
    provider?.[ProviderIdentityFlag.TokenPocket] &&
    !provider[ProviderIdentityFlag.TP],
  icon: walletIcons.tokenpocket,
});

const tp: Wallet = new InjectedConnector({
  name: 'TP',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.TP],
  icon: walletIcons.tp,
});

const xdefi: Wallet = new InjectedConnector({
  name: 'XDEFI',
  // eslint-disable-next-line dot-notation
  installed: ({ provider }) => true,
  icon: walletIcons.xdefi,
});

const oneInch: Wallet = new InjectedConnector({
  name: 'OneInch',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.OneInch],
  icon: walletIcons.oneInch,
});

const tokenary: Wallet = new InjectedConnector({
  name: 'Tokenary',
  installed: ({ provider }) => provider?.[ProviderIdentityFlag.Tokenary],
  icon: walletIcons.tokenary,
});

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
