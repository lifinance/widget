import type { Connector as BigmiConnector } from '@bigmi/client'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import type { Connector } from 'wagmi'
import type {
  CreateBigmiConnectorFnExtended,
  CreateConnectorFnExtended,
} from '../connectors/types.js'

export type WalletConnector =
  | Connector
  | WalletAdapter
  | CreateConnectorFnExtended
  | CreateBigmiConnectorFnExtended
  | BigmiConnector
