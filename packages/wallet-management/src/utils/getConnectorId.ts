import type { ConnectorType } from '../hooks/useAccount'

export const getConnectorId = (connector?: ConnectorType) => {
  if (!connector) {
    return undefined
  }
  return 'id' in connector && connector.id ? connector.id : connector.name
}
