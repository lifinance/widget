import type { BaseAccountParameters } from 'wagmi/connectors'
import { baseAccount } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createBaseAccountConnector = /*#__PURE__*/ (
  params: BaseAccountParameters
): CreateConnectorFnExtended =>
  extendConnector(baseAccount(params), 'baseAccount', 'Base Account')
