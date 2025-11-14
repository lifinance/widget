import type { ChainType } from '@lifi/sdk'
import type { WalletConnector } from '@lifi/widget-provider'

export const getConnectorId = (
  connector?: WalletConnector,
  chainType?: ChainType
): string => {
  if (!connector) {
    return ''
  }
  return 'id' in connector && connector.id
    ? connector.id
    : `${connector.name}-${chainType}`
}
