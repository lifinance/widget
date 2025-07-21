import type { MetaMaskParameters } from 'wagmi/connectors'
import { lifiLogoUrl } from '../icons.js'

export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: 'LI.FI',
    url:
      typeof window !== 'undefined'
        ? (window as any)?.location.href
        : 'https://li.fi/',
    iconUrl: lifiLogoUrl,
  },
}
