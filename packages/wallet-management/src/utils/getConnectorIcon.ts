import { getWalletIcon } from '../icons.js'
import type { WalletConnector } from '../types/walletConnector.js'

export const getConnectorIcon = (connector?: WalletConnector) => {
  const connectorId = connector?.id

  return connectorId
    ? getWalletIcon(connectorId) || connector?.icon
    : connector?.icon
}
