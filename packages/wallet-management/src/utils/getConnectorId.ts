import type { ChainType } from '@lifi/sdk'
import type { ConnectorType } from '../hooks/useAccount'

export const getConnectorId = (
  connector?: ConnectorType,
  chainType?: ChainType
) => {
  if (!connector) {
    return undefined
  }
  return 'id' in connector && connector.id
    ? connector.id
    : `${connector.name}-${chainType}`
}
