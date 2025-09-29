import type { Connector as BigmiConnector } from '@bigmi/client'
import type { CreateConnectorFnExtended } from '@lifi/wallet-provider-evm'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import type { Connector } from 'wagmi'

export type WalletConnector =
  | Connector
  | WalletAdapter
  | BigmiConnector
  | CreateConnectorFnExtended
  | WalletWithRequiredFeatures
