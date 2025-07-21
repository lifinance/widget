import type { CoinbaseWalletParameters } from 'wagmi/connectors'
import { lifiLogoUrl } from '../icons.js'

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: 'LI.FI',
  appLogoUrl: lifiLogoUrl,
}
