import type { CoinbaseWalletParameters } from 'wagmi/connectors'
import { lifiLogoUrl } from '../utils/lifi.js'

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: 'LI.FI',
  appLogoUrl: lifiLogoUrl,
}
