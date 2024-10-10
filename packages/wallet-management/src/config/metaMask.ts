import type { MetaMaskParameters } from 'wagmi/connectors'
import { LIFILogo } from '../icons/lifi.js'

export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: 'LI.FI',
    url:
      typeof window !== 'undefined'
        ? (window as any)?.location.href
        : 'https://li.fi/',
    base64Icon: LIFILogo,
  },
}
