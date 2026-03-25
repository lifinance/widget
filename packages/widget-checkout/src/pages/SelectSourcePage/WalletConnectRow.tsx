import type { CombinedWallet, WalletTagType } from '@lifi/wallet-management'
import {
  BitcoinListItemButton,
  EthereumListItemButton,
  SolanaListItemButton,
  SuiListItemButton,
} from '@lifi/wallet-management'
import { ChainType } from '@lifi/widget'

type WalletConnectRowComponent =
  | typeof EthereumListItemButton
  | typeof BitcoinListItemButton
  | typeof SolanaListItemButton
  | typeof SuiListItemButton

type WalletConnector = CombinedWallet['connectors'][number]['connector']

export type WalletConnectRowProps = {
  chainType: ChainType
  connector: WalletConnector
  ecosystemSelection?: boolean
  tagType?: WalletTagType
  onConnected?: () => void
  onConnecting?: () => void
  onError?: (error: unknown) => void
}

export function WalletConnectRow({
  chainType,
  connector,
  ecosystemSelection,
  tagType,
  onConnected,
  onConnecting,
  onError,
}: WalletConnectRowProps) {
  let ListItemButtonComponent: WalletConnectRowComponent | null = null
  switch (chainType) {
    case ChainType.EVM:
      ListItemButtonComponent = EthereumListItemButton
      break
    case ChainType.UTXO:
      ListItemButtonComponent = BitcoinListItemButton
      break
    case ChainType.SVM:
      ListItemButtonComponent = SolanaListItemButton
      break
    case ChainType.MVM:
      ListItemButtonComponent = SuiListItemButton
      break
  }

  if (!ListItemButtonComponent) {
    return null
  }

  return (
    <ListItemButtonComponent
      ecosystemSelection={ecosystemSelection}
      tagType={tagType}
      connector={connector}
      onConnected={onConnected}
      onConnecting={onConnecting}
      onError={onError}
    />
  )
}
