import type { BaseAccountParameters } from 'wagmi/connectors'
import { lifiLogoUrl } from '../icons.js'

export const defaultBaseAccountConfig: BaseAccountParameters = {
  appName: 'LI.FI',
  appLogoUrl: lifiLogoUrl,
}
