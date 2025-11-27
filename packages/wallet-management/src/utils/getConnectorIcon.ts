import type { WalletConnector } from '@lifi/widget-provider'
import { getWalletIcon } from '../icons'

export const getConnectorIcon = (connector?: WalletConnector) => {
  const connectorId = connector?.id

  return connectorId
    ? getWalletIcon(connectorId) || connector?.icon
    : connector?.icon
}
