import type { WidgetConfig } from '@lifi/widget';
import './index.css';

export const WidgetVariants = [
  'default',
  'expandable',
  'drawer',
  'refuel',
] as const;

export const widgetBaseConfig: WidgetConfig = {
  // fromChain: 137,
  // toChain: 10,
  // fromToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  // toToken: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // 0x0000000000000000000000000000000000000000
  // fromAmount: '20',
  // toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',

  variant: 'nft',
  integrator: 'li.fi-playground',
  hiddenUI: ['history'],
  chains: {
    allow: [], // 1, 1285, 10, 56, 137
    deny: [],
  },
  // useRecommendedRoute: true,
  buildSwapUrl: true,
  // disabledUI: ['toAddress', 'fromAmount', 'toToken', 'fromToken'],
  sdkConfig: {
    // apiUrl: 'https://staging.li.quest/v1/',
    defaultRouteOptions: {
      // slippage: 0.03,
      // order: 'SAFEST',
      // allowSwitchChain: false,
      // fee: 0.05
    },
  },
  // theme: {
  //   palette: {
  //     background: {
  //       paper: '#121212',
  //     },
  //   },
  // },
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
  //     button: { swap: 'Test' },
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
