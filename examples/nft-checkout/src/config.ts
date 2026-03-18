import type { WidgetConfig } from '@lifi/widget'
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { SuiProvider } from '@lifi/widget-provider-sui'
import './index.css'

export const widgetBaseConfig: WidgetConfig = {
  subvariant: 'custom',
  integrator: 'li.fi-playground',
  providers: [
    EthereumProvider(),
    BitcoinProvider(),
    SolanaProvider(),
    SuiProvider(),
  ],
  hiddenUI: ['history'],
  // buildUrl: true,
  sdkConfig: {
    apiUrl: 'https://li.quest/v1',
    routeOptions: {
      // maxPriceImpact: 0.4,
    },
  },
}

export const widgetConfig: WidgetConfig = {
  ...widgetBaseConfig,
  theme: {
    container: {
      boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
      borderRadius: '16px',
    },
  },
}
