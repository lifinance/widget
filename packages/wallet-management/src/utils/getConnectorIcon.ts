import { getWalletIcon } from '../icons.js'

export const getConnectorIcon = (connector?: any) => {
  const connectorId = connector?.id

  return connectorId
    ? getWalletIcon(connectorId) || connector?.icon
    : connector?.icon
}
