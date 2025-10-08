import type { CreateConnectorFn } from 'wagmi'
import type { CreateConnectorFnExtended } from '../types.js'

export const extendConnector = (
  connector: CreateConnectorFn,
  id: string,
  name: string
): CreateConnectorFnExtended => {
  const extendedConnector = connector as CreateConnectorFnExtended
  extendedConnector.id = id
  extendedConnector.displayName = name
  return extendedConnector
}
