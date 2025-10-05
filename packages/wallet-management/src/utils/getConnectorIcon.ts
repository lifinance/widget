import type { WalletConnector } from '@lifi/wallet-provider'
import { getWalletIcon } from '../icons.js'

export const getConnectorIcon = (connector?: WalletConnector) => {
  const connectorId = connector?.id

  return connectorId
    ? getWalletIcon(connectorId) || connector?.icon
    : connector?.icon
}
