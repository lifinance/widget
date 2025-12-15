import type { BaseAccountParameters } from 'wagmi/connectors'
import type { CreateConnectorFnExtended } from '../types.js'
import { extendConnector } from '../utils/extendConnector.js'

export const createBaseAccountConnector = async (
  params: BaseAccountParameters
): Promise<CreateConnectorFnExtended> => {
  const { baseAccount } = await import('wagmi/connectors')
  return extendConnector(baseAccount(params), 'baseAccount', 'Base Account')
}
