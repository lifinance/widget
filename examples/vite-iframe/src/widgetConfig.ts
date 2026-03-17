import { ChainId } from '@lifi/sdk'
import type { WidgetLightConfig } from '@lifi/widget-light'

/**
 * Widget configuration sent to the iframe.
 * Must be JSON-serialisable — no React nodes or callback functions.
 */
export const widgetConfig: WidgetLightConfig = {
  integrator: 'vite-iframe-example',
  variant: 'wide',
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
  sdkConfig: {
    rpcUrls: {
      [ChainId.SOL]: [
        'https://wild-winter-frog.solana-mainnet.quiknode.pro/2370a45ff891f6dc9e5b1753460290fe0f1ef103/',
        'https://dacey-pp61jd-fast-mainnet.helius-rpc.com/',
      ],
    },
    routeOptions: {
      maxPriceImpact: 0.4,
      jitoBundle: true,
    },
  },
}
