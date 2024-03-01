export const files = {
  'package.json': {
    content: {
      name: 'simple-widget-react',
      dependencies: {
        '@lifi/widget': '^3.0.0-alpha.31',
        '@tanstack/react-query': '^5.17.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        wagmi: '2.5.7',
      },
      devDependencies: {
        '@types/react': '^18.2.56',
        '@types/react-dom': '^18.2.19',
        typescript: '^5.2.2',
      },
    },
  },
  'tsconfig.node.json': {
    content:
      '{\n  "compilerOptions": {\n    "composite": true,\n    "skipLibCheck": true,\n    "module": "ESNext",\n    "moduleResolution": "bundler",\n    "allowSyntheticDefaultImports": true,\n    "strict": true\n  },\n  "include": ["vite.config.ts"]\n}\n',
  },
  'tsconfig.json': {
    content:
      '{\n  "compilerOptions": {\n    "target": "ES2020",\n    "useDefineForClassFields": true,\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx",\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true\n  },\n  "include": ["src"],\n  "references": [{ "path": "./tsconfig.node.json" }]\n}\n',
  },
  'index.html': {
    content:
      '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Widget Example</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>\n',
  },
  'index.tsx': {
    content:
      "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport { LiFiWidget } from '@lifi/widget';\nimport { config } from './config.ts';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <LiFiWidget config={config} integrator=\"li.fi-playground\" open />\n  </React.StrictMode>,\n);\n",
  },
  'index.css': {
    content:
      ':root {\n  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n#root {\n    max-width: 1280px;\n    margin: 0 auto;\n    padding: 2rem;\n    text-align: center;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n',
  },
  'config.ts': {
    content:
      "import { WidgetConfig } from '@lifi/widget';\n\nexport const config = {\n  variant: 'expandable',\n  integrator: 'li.fi-playground',\n  buildUrl: true,\n  insurance: true,\n  sdkConfig: {\n    apiUrl: 'https://li.quest/v1',\n    rpcUrls: {\n      1151111081099710: [\n        'https://withered-lingering-frog.solana-mainnet.quiknode.pro/',\n      ],\n    },\n    routeOptions: {\n      maxPriceImpact: 0.4,\n    },\n  },\n  tokens: {\n    featured: [\n      {\n        address: '0x0000000000000000000000000000000000000000',\n        symbol: 'BNB',\n        decimals: 18,\n        chainId: 56,\n        name: 'BNB',\n        logoURI:\n          'https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg',\n      },\n      {\n        address: '0x195e3087ea4d7eec6e9c37e9640162fe32433d5e',\n        symbol: '$ALTI',\n        decimals: 18,\n        chainId: 56,\n        name: 'Altimatum',\n        logoURI:\n          'https://s2.coinmarketcap.com/static/img/coins/64x64/21303.png',\n      },\n      {\n        address: '0x2fd6c9b869dea106730269e13113361b684f843a',\n        symbol: 'CHH',\n        decimals: 9,\n        chainId: 56,\n        name: 'Chihuahua',\n        logoURI:\n          'https://s2.coinmarketcap.com/static/img/coins/64x64/21334.png',\n      },\n    ],\n    popular: [\n      {\n        address: '0x0000000000000000000000000000000000000000',\n        symbol: 'BNB',\n        decimals: 18,\n        chainId: 56,\n        name: 'BNB',\n        logoURI:\n          'https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg',\n      },\n      {\n        address: '0xCC42724C6683B7E57334c4E856f4c9965ED682bD',\n        symbol: 'MATIC',\n        decimals: 18,\n        chainId: 56,\n        name: 'Matic',\n        logoURI: 'https://bscscan.com/token/images/polygonmatic_new_32.png',\n      },\n      {\n        address: '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4',\n        symbol: 'SUSHI',\n        decimals: 18,\n        chainId: 56,\n        name: 'Sushi',\n      },\n      {\n        address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',\n        symbol: 'DAI',\n        decimals: 18,\n        chainId: 56,\n        name: 'DAI',\n        logoURI: 'https://bscscan.com/token/images/dai_32.png',\n      },\n      {\n        address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',\n        symbol: 'WETH',\n        decimals: 18,\n        chainId: 56,\n        name: 'Wrapped ETH',\n        logoURI: 'https://bscscan.com/token/images/ethereum_32.png',\n      },\n      {\n        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',\n        symbol: 'WBNB',\n        decimals: 18,\n        chainId: 56,\n        name: 'Wrapped BNB',\n        logoURI:\n          'https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg',\n      },\n    ],\n    deny: [],\n    allow: [],\n  },\n  appearance: 'auto',\n  theme: {\n    palette: {\n      primary: {\n        main: '#5C67FF',\n      },\n      secondary: {\n        main: '#F5B5FF',\n      },\n    },\n    typography: {\n      fontFamily: 'Inter, sans-serif',\n    },\n  },\n  containerStyle: {\n    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',\n    borderRadius: '16px',\n  },\n} as WidgetConfig;\n",
  },
};
