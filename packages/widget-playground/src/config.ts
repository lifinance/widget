import { supportedWallets } from '@lifi/wallet-management';
import type { WidgetConfig } from '@lifi/widget';
import './index.css';

export const METAMASK_WALLET = supportedWallets.find(
  (wallet) => wallet.name === 'MetaMask',
);

export const WidgetVariants = ['default', 'expandable', 'drawer'] as const;

export const WidgetSubvariants = ['default', 'split', 'refuel'] as const;

export const widgetBaseConfig: WidgetConfig = {
  // fromChain: 137,
  // toChain: 10,
  // fromToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  // toToken: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // 0x0000000000000000000000000000000000000000
  // fromAmount: '20',
  // toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',

  variant: 'expandable',
  // subvariant: 'split',
  integrator: 'li.fi-playground',
  chains: {
    allow: [], // 1, 1285, 10, 56, 137
    deny: [],
  },
  // useRecommendedRoute: true,
  buildUrl: true,
  // hiddenUI: ['poweredBy', 'language', 'appearance', 'drawerButton'],
  // disabledUI: ['toAddress', 'fromAmount', 'toToken', 'fromToken'],
  // requiredUI: ['toAddress'],
  // slippage: 0.003,
  insurance: true,
  sdkConfig: {
    // apiUrl: 'https://develop.li.quest/v1',
    defaultRouteOptions: {
      maxPriceImpact: 0.4,
      // slippage: 0.03,
      // order: 'SAFEST',
      // allowSwitchChain: false,
      // fee: 0.05
    },
  },
  // theme: {
  //   palette: {
  //     primary: { main: '#FFCF7D' },
  //     secondary: { main: '#FFCF7D' },
  //     background: {
  //       paper: 'rgba(14, 35, 48, 0.4)', // background cards
  //       default: 'rgba(0, 0, 0, 0)', // background container
  //     },
  //     grey: {
  //       300: '#5C4219', // border light theme
  //       800: '#5C4219', // border dark theme
  //     },
  //   },
  // },
  tokens: {
    featured: [
      // {
      //   address: '0xba98c0fbebc892f5b07a42b0febd606913ebc981',
      //   symbol: 'MEH',
      //   decimals: 18,
      //   chainId: 1,
      //   name: 'meh',
      //   logoURI:
      //     'https://s2.coinmarketcap.com/static/img/coins/64x64/22158.png',
      // },
      {
        address: '0x195e3087ea4d7eec6e9c37e9640162fe32433d5e',
        symbol: '$ALTI',
        decimals: 18,
        chainId: 56,
        name: 'Altimatum',
        logoURI:
          'https://s2.coinmarketcap.com/static/img/coins/64x64/21303.png',
      },
      {
        address: '0x60d8d17d6b824e19f77eaccaf16ed7ba6fb209c2',
        symbol: 'SERENE',
        decimals: 18,
        chainId: 250,
        name: 'Serenity V2',
        logoURI:
          'https://static.debank.com/image/ftm_token/logo_url/0x60d8d17d6b824e19f77eaccaf16ed7ba6fb209c2/5842f60d05f1d9ce473d0c3f70917c86.png',
      },
      {
        address: '0x2fd6c9b869dea106730269e13113361b684f843a',
        symbol: 'CHH',
        decimals: 9,
        chainId: 56,
        name: 'Chihuahua',
        logoURI:
          'https://s2.coinmarketcap.com/static/img/coins/64x64/21334.png',
      },
    ],
    deny: [
      // {
      //   address: '0x4200000000000000000000000000000000000006',
      //   chainId: 10,
      // },
      // {
      //   address: '0x0000000000000000000000000000000000000000',
      //   chainId: 10,
      // },
      // {
      //   address: '0x4200000000000000000000000000000000000042',
      //   chainId: 10,
      //   decimals: 18,
      //   logoURI:
      //     'https://static.debank.com/image/op_token/logo_url/0x4200000000000000000000000000000000000042/95a6d2edd6dac44e08dd277bb10fbfe9.png',
      //   name: 'Optimism',
      //   priceUSD: '1.149',
      //   symbol: 'OP',
      // },
    ],
    allow: [
      // {
      //   address: '0x4200000000000000000000000000000000000042',
      //   chainId: 10,
      //   decimals: 18,
      //   logoURI:
      //     'https://static.debank.com/image/op_token/logo_url/0x4200000000000000000000000000000000000042/95a6d2edd6dac44e08dd277bb10fbfe9.png',
      //   name: 'Optimism',
      //   priceUSD: '1.149',
      //   symbol: 'OP',
      // },
    ],
  },
  bridges: {
    // allow: ['stargate'],
    // deny: ['connext'],
  },
  languages: {
    // allow: ['uk'],
    // deny: ['uk'],
  },
  // languageResources: {
  //   en: {
  //     button: { exchange: 'Test' },
  //   },
  //   es,
  // },
};

export const widgetConfig: WidgetConfig = {
  ...widgetBaseConfig,
  containerStyle: {
    // border: `1px solid ${
    //   window.matchMedia('(prefers-color-scheme: dark)').matches
    //     ? 'rgb(66, 66, 66)'
    //     : 'rgb(234, 234, 234)'
    // }`,
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
  },
  // theme: {
  //   components: {
  //     MuiAvatar: {
  //       defaultProps: {
  //         imgProps: { crossOrigin: 'anonymous' },
  //       },
  //     },
  //   },
  // },
};
