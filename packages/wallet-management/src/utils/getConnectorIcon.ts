import type { Connector as BigmiConnector } from '@bigmi/client'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletConnector as SolanaWalletConnector } from '@solana/client-core'
import type { Connector } from 'wagmi'
import { getWalletIcon } from '../icons.js'

export const getConnectorIcon = (
  connector?:
    | Connector
    | SolanaWalletConnector
    | BigmiConnector
    | WalletWithRequiredFeatures
) => {
  const connectorId = (connector as Connector)?.id

  return connectorId
    ? getWalletIcon(connectorId) || connector?.icon
    : connector?.icon
}
