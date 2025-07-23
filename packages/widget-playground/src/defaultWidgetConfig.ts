import { ChainId } from '@lifi/sdk'
import type { WidgetConfig } from '@lifi/widget'

export const widgetBaseConfig: WidgetConfig = {
  // fromChain: 137,
  // toChain: 10,
  // fromToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  // toToken: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // 0x0000000000000000000000000000000000000000
  // fromAmount: '20',
  minFromAmountUSD: 100,
  // toAddress: {
  //   name: 'Jenny',
  //   address: '0xb9c0dE368BECE5e76B52545a8E377a4C118f597B',
  //   chainType: ChainType.EVM,
  // },
  // toAddresses: [
  //   {
  //     name: 'Lenny',
  //     address: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea9',
  //     chainType: ChainType.EVM,
  //   },
  //   {
  //     address: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
  //     chainType: ChainType.EVM,
  //   },
  //   {
  //     name: 'Sol',
  //     address: '6AUWsSCRFSCbrHKH9s84wfzJXtD6mNzAHs11x6pGEcmJ',
  //     chainType: ChainType.SVM,
  //   },
  // ],
  variant: 'wide',
  // subvariant: 'split',
  subvariantOptions: {
    wide: {
      enableChainSidebar: true,
    },
  },
  integrator: 'li.fi-playground',
  // fee: 0.01,
  // useRecommendedRoute: true,
  useRelayerRoutes: true,
  buildUrl: true,
  // hiddenUI: ['poweredBy', 'language', 'appearance', 'drawerButton', 'toAddress'],
  // disabledUI: ['toAddress', 'fromAmount', 'toToken', 'fromToken'],
  // requiredUI: ['toAddress'],
  // defaultUI: {
  //   navigationHeaderTitleNoWrap: false,
  // },
  // slippage: 0.003,
  // walletConfig: {
  //   usePartialWalletManagement: true,
  // },
  sdkConfig: {
    apiUrl: 'https://li.quest/v1',
    rpcUrls: {
      [ChainId.SOL]: ['https://dacey-pp61jd-fast-mainnet.helius-rpc.com/'],
    },
    routeOptions: {
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
  // chains: {
  //   types: {
  //     allow: [ChainType.EVM],
  //   },
  //   allow: [ChainId.ETH, ChainId.OPT],
  // },
  tokens: {
    featured: [
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'BNB',
        decimals: 18,
        chainId: 56,
        name: 'BNB',
        logoURI:
          'https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg',
      },
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
        address: '0x2fd6c9b869dea106730269e13113361b684f843a',
        symbol: 'CHH',
        decimals: 9,
        chainId: 56,
        name: 'Chihuahua',
        logoURI:
          'https://s2.coinmarketcap.com/static/img/coins/64x64/21334.png',
      },
    ],
    popular: [
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'BNB',
        decimals: 18,
        chainId: 56,
        name: 'BNB',
        logoURI:
          'https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg',
      },
      {
        address: '0xCC42724C6683B7E57334c4E856f4c9965ED682bD',
        symbol: 'MATIC',
        decimals: 18,
        chainId: 56,
        name: 'Matic',
        logoURI: 'https://bscscan.com/token/images/polygonmatic_new_32.png',
      },
      {
        address: '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4',
        symbol: 'SUSHI',
        decimals: 18,
        chainId: 56,
        name: 'Sushi',
      },
      {
        address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
        symbol: 'DAI',
        decimals: 18,
        chainId: 56,
        name: 'DAI',
        logoURI: 'https://bscscan.com/token/images/dai_32.png',
      },
      {
        address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
        symbol: 'WETH',
        decimals: 18,
        chainId: 56,
        name: 'Wrapped ETH',
        logoURI: 'https://bscscan.com/token/images/ethereum_32.png',
      },
      {
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        symbol: 'WBNB',
        decimals: 18,
        chainId: 56,
        name: 'Wrapped BNB',
        logoURI:
          'https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg',
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
  // bridges: {
  //   allow: ['stargate'],
  //   deny: ['amarok'],
  // },
  // languages: {
  //   allow: ['uk'],
  //   deny: ['uk'],
  // },
  // languageResources: {
  //   en: {
  //     button: { exchange: 'Test' },
  //   },
  //   es,
  // },
  // explorerUrls: {
  //   42161: ['https://scan.li.fi'], // Arbitrum
  //   internal: ['https://jumper.exchange/scan'], // Transder ID Card
  // },
  // routeLabels: [
  //   {
  //     label: {
  //       text: 'OP Reward',
  //       sx: {
  //         background: 'linear-gradient(90deg, #ff0404, #ff04c8)',
  //         '@keyframes gradient': {
  //           '0%': { backgroundPosition: '0% 50%' },
  //           '50%': { backgroundPosition: '100% 50%' },
  //           '100%': { backgroundPosition: '0% 50%' },
  //         },
  //         animation: 'gradient 3s ease infinite',
  //         backgroundSize: '200% 200%',
  //         color: '#ffffff',
  //       },
  //     },
  //     fromChainId: [ChainId.OPT],
  //   },
  //   {
  //     label: {
  //       text: 'LI.FI Bonus',
  //       sx: () => ({
  //         display: 'flex',
  //         alignItems: 'center',
  //         position: 'relative',
  //         overflow: 'hidden',
  //         marginLeft: 'auto',
  //         order: 1,
  //         backgroundImage:
  //           'url(https://lifinance.github.io/types/src/assets/icons/exchanges/lifidexaggregator.svg)',
  //         backgroundPosition: 'left center',
  //         backgroundRepeat: 'no-repeat',
  //         backgroundSize: '24px',
  //         paddingLeft: '12px',
  //         backgroundColor: '#F7C2FF',
  //       }),
  //     },
  //     fromChainId: [ChainId.OPT],
  //     exchanges: {
  //       allow: ['lifidexaggregator'],
  //     },
  //   },
  // ],
}

export const defaultWidgetConfig: Partial<WidgetConfig> = {
  ...widgetBaseConfig,
  appearance: 'system',
  theme: {
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
          secondary: {
            main: '#F7C2FF',
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
          secondary: {
            main: '#F7C2FF',
          },
        },
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
    container: {
      boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
      borderRadius: '16px',
    },
    // routesContainer: {
    //   boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
    //   borderRadius: '16px',
    // },
    // chainSidebarContainer: {
    //   boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
    //   borderRadius: '16px',
    // },
  },
} as WidgetConfig
