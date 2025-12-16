import { type BaseAccountParameters, baseAccount } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createBaseAccountConnector = (
  params: BaseAccountParameters
): CreateConnectorFnExtended => {
  return extendConnector(baseAccount(params), 'baseAccount', 'Base Account')
}
