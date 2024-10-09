import type { CoinbaseWalletParameters } from 'wagmi/connectors'
import { LIFILogo } from '../icons/lifi.js'

export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: 'LI.FI',
  appLogoUrl: LIFILogo,
}
