import {
  safe as _safe,
  walletConnect as _walletConnect,
  coinbaseWallet,
  injected,
} from 'wagmi/connectors';
import { walletIcons } from './walletIcons';

export const metaMask = injected({
  target: {
    id: 'metaMaskSDK',
    name: 'MetaMask',
    icon: walletIcons.metamask,
    provider: (window as any)?.ethereum,
  },
}); // _metaMask();

export const walletConnect = /*@__PURE__*/ _walletConnect({
  projectId: '5432e3507d41270bee46b7b85bbc2ef8',
  showQrModal: true,
  qrModalOptions: {
    themeVariables: {
      '--w3m-z-index': '3000',
    },
  },
});

export const coinbase: ReturnType<typeof coinbaseWallet> =
  /*@__PURE__*/ coinbaseWallet({
    appName: 'LI.FI',
  });

export const safe = /*@__PURE__*/ _safe();

// Unknown wallet that injects as metamask but is not metamask
export const defaultWallet = /*@__PURE__*/ injected({
  target: {
    id: 'default',
    name: 'Default Wallet',
    icon: walletIcons.placeholder,
    provider: (window as any)?.ethereum,
  },
});

export const bitget = injected({
  target: {
    id: 'bitget',
    name: 'Bitget Wallet',
    icon: walletIcons.bitGet,
    provider: (window as any).bitkeep?.ethereum,
  },
});

export const gate = injected({
  target: {
    id: 'gate',
    name: 'Gate Wallet',
    icon: walletIcons.gate,
    provider: (window as any).gatewallet,
  },
});

export const frontier = injected({
  target: {
    id: 'frontier',
    name: 'Frontier',
    icon: walletIcons.frontier,
    provider: (window as any).frontier?.ethereum,
  },
});

export const safepal = injected({
  target: {
    id: 'safepal',
    name: 'SafePal',
    icon: walletIcons.safepal,
    provider: (window as any).ethereum,
  },
});

export const brave = injected({
  target: {
    id: 'brave',
    name: 'Brave',
    icon: walletIcons.brave,
    provider: (window as any).ethereum,
  },
});

export const taho = injected({
  target: {
    id: 'taho',
    name: 'Taho',
    icon: walletIcons.tallyho,
    provider: (window as any).tally,
  },
});

export const block = injected({
  target: {
    id: 'block',
    name: 'BlockWallet',
    icon: walletIcons.blockwallet,
    provider: (window as any).ethereum,
  },
});

export const binance = injected({
  target: {
    id: 'binance',
    name: 'Binance',
    icon: walletIcons.binance,
    provider: (window as any).BinanceChain,
  },
});

export const trust = injected({
  target: {
    id: 'trust',
    name: 'Trust',
    icon: walletIcons.trust,
    provider: (window as any).trustWallet,
  },
});

export const status = injected({
  target: {
    id: 'status',
    name: 'Status',
    icon: walletIcons.status,
    provider: (window as any).ethereum,
  },
});

export const alpha = injected({
  target: {
    id: 'alpha',
    name: 'AlphaWallet',
    icon: walletIcons.alphawallet,
    provider: (window as any).ethereum,
  },
});

export const bitpie = injected({
  target: {
    id: 'bitpie',
    name: 'Bitpie',
    icon: walletIcons.bitpie,
    provider: (window as any).ethereum,
  },
});

export const dcent = injected({
  target: {
    id: 'dcent',
    name: 'Dcent',
    icon: walletIcons.dcent,
    provider: (window as any).ethereum,
  },
});

export const frame = injected({
  target: {
    id: 'frame',
    name: 'Frame',
    icon: walletIcons.frame,
    provider: (window as any).frame,
  },
});

export const hyperpay = injected({
  target: {
    id: 'hyperpay',
    name: 'HyperPay',
    icon: walletIcons.hyperpay,
    provider: (window as any).ethereum,
  },
});

export const imtoken = injected({
  target: {
    id: 'imtoken',
    name: 'ImToken',
    icon: walletIcons.imtoken,
    provider: (window as any).ethereum,
  },
});

export const liquality = injected({
  target: {
    id: 'liquality',
    name: 'Liquality',
    icon: walletIcons.liquality,
    provider: (window as any).liquality,
  },
});

export const ownbit = injected({
  target: {
    id: 'ownbit',
    name: 'OwnBit',
    icon: walletIcons.ownbit,
    provider: (window as any).ethereum,
  },
});

export const tokenpocket = injected({
  target: {
    id: 'tokenpocket',
    name: 'TokenPocket',
    icon: walletIcons.tokenpocket,
    provider: (window as any).ethereum,
  },
});

export const xdefi = injected({
  target: {
    id: 'xdefi',
    name: 'XDEFI',
    icon: walletIcons.xdefi,
    provider: (window as any).ethereum,
  },
});

export const oneinch = injected({
  target: {
    id: '1inch',
    name: '1inch',
    icon: walletIcons.oneInch,
    provider: (window as any).ethereum,
  },
});

export const tokenary = injected({
  target: {
    id: 'tokenary',
    name: 'Tokenary',
    icon: walletIcons.tokenary,
    provider: (window as any).ethereum,
  },
});

export const okx = injected({
  target: {
    id: 'okx',
    name: 'OKX',
    icon: walletIcons.okx,
    provider: (window as any).okxwallet,
  },
});

export const exodus = injected({
  target: {
    id: 'exodus',
    name: 'Exodus',
    icon: walletIcons.exodus,
    provider: (window as any).exodus?.ethereum,
  },
});
