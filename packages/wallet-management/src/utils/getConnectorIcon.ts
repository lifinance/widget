import type { Connector as BigmiConnector } from '@bigmi/client'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import type { Connector } from 'wagmi'
import { getWalletIcon } from '../icons.js'

export const getConnectorIcon = (
  connector?:
    | Connector
    | WalletAdapter
    | BigmiConnector
    | WalletWithRequiredFeatures
) => {
  const connectorId = (connector as Connector)?.id

  return connectorId
    ? getWalletIcon(connectorId) || connector?.icon
    : connector?.icon
}
