import type { Connector as BigmiConnector } from '@bigmi/client'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { UiWallet } from '@wallet-standard/react'
import type { Connector } from 'wagmi'
import type { CreateConnectorFnExtended } from '../connectors/types.js'

export type WalletConnector =
  | Connector
  | BigmiConnector
  | CreateConnectorFnExtended
  | WalletWithRequiredFeatures
  | UiWallet
