import type { CoinbaseWalletParameters } from 'wagmi/connectors'
import { lifiLogoUrl } from '../icons/lifi.js'

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: 'LI.FI',
  appLogoUrl: lifiLogoUrl,
}
