import { supportedChains } from '@lifi/sdk';
import type { EthereumRpcMap } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';
import { InjectedConnector } from './connectors/injectedConnector';
import { WalletConnectConnector } from './connectors/walletConnectConnector';
import type { Wallet } from './types';
import { ProviderIdentityFlag } from './types';
import { walletIcons } from './walletIcons';

const defaultWallet: Wallet = new InjectedConnector({
  // unknown Default wallet that injects as metamask but is not metamask
  name: 'Default Wallet',
  installed: () =>
    !!(window as any).ethereum &&
    !(window as any)?.ethereum?.[ProviderIdentityFlag.MetaMask],
  icon: walletIcons.placeholder,
});

const metamask: Wallet = new InjectedConnector({
  name: 'MetaMask',
  installed: () => !!(window as any)?.ethereum?.[ProviderIdentityFlag.MetaMask],
  icon: walletIcons.metamask,
});

const walletConnect: Wallet = new WalletConnectConnector({
  name: 'Wallet Connect',
  installed: () => true,
  icon: walletIcons.walletConnect,
  options: {
    projectId: '5432e3507d41270bee46b7b85bbc2ef8',
    rpcMap: supportedChains.reduce((rpcMap, chain) => {
      rpcMap[`eip155:${chain.id}`] = chain.metamask.rpcUrls[0] || '';
      return rpcMap;
    }, {} as EthereumRpcMap),
    chains: supportedChains.map((chain) => chain.id),
    showQrModal: false,
  },
});

const frontier: Wallet = new InjectedConnector(
  {
    name: 'Frontier',
    installed: () => (window as any).frontier,
    icon: walletIcons.frontier,
  },
  (window as any).frontier?.ethereum,
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
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.MathWallet],
  icon: walletIcons.mathwallet,
});

const tallyho: Wallet = new InjectedConnector(
  {
    name: 'Taho',
    installed: () =>
      (window as any).tally &&
      (window as any).tally?.[ProviderIdentityFlag.TallyHo],
    icon: walletIcons.tallyho,
  },
  (window as any).tally,
);

const blockWallet: Wallet = new InjectedConnector({
  name: 'BlockWallet',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.BlockWallet],
  icon: walletIcons.blockwallet,
});

const binance: Wallet = new InjectedConnector(
  {
    name: 'Binance',
    installed: () => (window as any).BinanceChain,
    icon: walletIcons.binance,
  },
  (window as any).BinanceChain,
);

const coinbase: Wallet = new InjectedConnector(
  {
    name: 'Coinbase',
    installed: () => (window as any).coinbaseWalletExtension,
    icon: walletIcons.coinbase,
  },
  (window as any).coinbaseWalletExtension,
);

const trust: Wallet = new InjectedConnector(
  {
    name: 'Trust',
    installed: () => (window as any).trustWallet,
    icon: walletIcons.trust,
  },
  (window as any).trustWallet,
);

const status: Wallet = new InjectedConnector({
  name: 'Status',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.Status],
  icon: walletIcons.status,
});

const alphawallet: Wallet = new InjectedConnector({
  name: 'AlphaWallet',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.AlphaWallet],
  icon: walletIcons.alphawallet,
});

const atoken: Wallet = new InjectedConnector({
  name: 'AToken',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.AToken],
  icon: walletIcons.atoken,
});

const apex: Wallet = new InjectedConnector({
  name: 'Apex Wallet',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.ApexWallet],
  icon: walletIcons.placeholder,
});

const bitpie: Wallet = new InjectedConnector({
  name: 'Bitpie',
  installed: () => (window as any).ethereum?.Bitpie,
  icon: walletIcons.bitpie,
});

const dcent: Wallet = new InjectedConnector({
  name: 'Dcent',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.Dcent],
  icon: walletIcons.dcent,
});

const frame: Wallet = new InjectedConnector(
  {
    name: 'Frame',
    installed: () => (window as any).frame,
    icon: walletIcons.frame,
  },
  (window as any).frame,
);

const huobiwallet: Wallet = new InjectedConnector({
  name: 'HuobiWallet',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.HuobiWallet],
  icon: walletIcons.huobiwallet,
});

const hyperpay: Wallet = new InjectedConnector({
  name: 'HyperPay',
  // Note: The property `hiWallet` is as of now the only known way of identifying hyperpay
  // wallet as it is a direct clone of metamask. `checkProviderIdentity` implementation is subject to
  // future changes
  installed: () => (window as any).ethereum?.hiWallet,
  icon: walletIcons.hyperpay,
});

const imtoken: Wallet = new InjectedConnector({
  name: 'ImToken',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.ImToken],
  icon: walletIcons.imtoken,
});

const liquality: Wallet = new InjectedConnector(
  {
    name: 'Liquality',
    installed: () => (window as any).liquality,
    icon: walletIcons.liquality,
  },
  (window as any).liquality,
);

const meetone: Wallet = new InjectedConnector({
  name: 'MeetOne',
  installed: () =>
    (window as any).ethereum?.[ProviderIdentityFlag.MeetOne] === 'MEETONE',
  icon: walletIcons.meetone,
});

const mykey: Wallet = new InjectedConnector({
  name: 'MyKey',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.MyKey],
  icon: walletIcons.mykey,
});

const ownbit: Wallet = new InjectedConnector({
  name: 'OwnBit',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.OwnBit],
  icon: walletIcons.ownbit,
});

const tokenpocket: Wallet = new InjectedConnector({
  name: 'TokenPocket',
  installed: () =>
    (window as any).ethereum?.[ProviderIdentityFlag.TokenPocket] &&
    !(window as any).ethereum?.[ProviderIdentityFlag.TP],
  icon: walletIcons.tokenpocket,
});

const xdefi: Wallet = new InjectedConnector({
  name: 'XDEFI',
  // eslint-disable-next-line dot-notation
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.XDEFI],
  icon: walletIcons.xdefi,
});

const oneInch: Wallet = new InjectedConnector({
  name: 'OneInch',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.OneInch],
  icon: walletIcons.oneInch,
});

const tokenary: Wallet = new InjectedConnector({
  name: 'Tokenary',
  installed: () => (window as any).ethereum?.[ProviderIdentityFlag.Tokenary],
  icon: walletIcons.tokenary,
});

const exodus: Wallet = new InjectedConnector(
  {
    name: 'Exodus',
    installed: () => (window as any).exodus?.ethereum,
    icon: walletIcons.exodus,
  },
  (window as any).exodus?.ethereum,
);

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
];
