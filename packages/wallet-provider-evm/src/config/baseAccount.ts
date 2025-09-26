import type { BaseAccountParameters } from 'wagmi/connectors'
import { lifiLogoUrl } from '../utils/lifi.js'

export const defaultBaseAccountConfig: BaseAccountParameters = {
  appName: 'LI.FI',
  appLogoUrl: lifiLogoUrl,
}
