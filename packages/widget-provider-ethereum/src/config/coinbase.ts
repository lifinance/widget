import type { CoinbaseWalletParameters } from 'wagmi/connectors'
import { lifiLogoUrl } from '../utils/lifi'

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: 'LI.FI',
  appLogoUrl: lifiLogoUrl,
}
