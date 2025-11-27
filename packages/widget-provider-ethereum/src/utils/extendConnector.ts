import type { CreateConnectorFn } from 'wagmi'
import type { CreateConnectorFnExtended } from '../types'

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
