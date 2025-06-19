import type { Connector as BigmiConnector } from '@bigmi/client'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { UiWallet } from '@wallet-standard/react'
import type { Connector } from 'wagmi'
import { getWalletIcon } from '../icons.js'

export const getConnectorIcon = (
  connector?: Connector | UiWallet | BigmiConnector | WalletWithRequiredFeatures
) => {
  const connectorId = (connector as Connector)?.id

  return connectorId
    ? getWalletIcon(connectorId) || connector?.icon
    : connector?.icon
}
