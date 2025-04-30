import type { Connector as BigmiConnector } from '@bigmi/client'
import type { Connector } from 'wagmi'

export interface WalletListItemButtonProps {
  ecosystemSelection?: boolean
  onNotInstalled?(connector: Connector | BigmiConnector): void
  onConnected?(): void
  onConnecting?(): void
  onError?(error: unknown): void
}
