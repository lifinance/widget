import type { Connector as BigmiConnector } from '@bigmi/client'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import type { Connector } from 'wagmi'
import type { CreateConnectorFnExtended } from '../connectors/types.js'

export type WalletConnector =
  | Connector
  | WalletAdapter
  | BigmiConnector
  | CreateConnectorFnExtended
  | WalletWithRequiredFeatures
