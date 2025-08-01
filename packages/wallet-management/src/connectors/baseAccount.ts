import type { BaseAccountParameters } from 'wagmi/connectors'
import { baseAccount } from 'wagmi/connectors'
import { extendConnector } from './utils.js'

export const createBaseAccountConnector = /*#__PURE__*/ (
  params: BaseAccountParameters
) => extendConnector(baseAccount(params), 'baseAccount', 'Base Account')
