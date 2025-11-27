import { ChainId, ChainType } from '@lifi/sdk'
import { isWalletInstalled, useBitcoinContext } from '@lifi/widget-provider'
import { useLastConnectedAccount } from '../hooks/useAccount'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents'
import { getChainTypeIcon } from '../icons'
import { WalletManagementEvent } from '../types/events'
import { WalletTagType } from '../types/walletTagType'
import { getConnectorIcon } from '../utils/getConnectorIcon'
import { CardListItemButton } from './CardListItemButton'
import type { WalletListItemButtonProps } from './types'

export const BitcoinListItemButton = ({
  ecosystemSelection,
  connector,
  tagType,
  onNotInstalled,
  onConnected,
  onConnecting,
  onError,
}: WalletListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const { connect, disconnect, isConnected } = useBitcoinContext()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorDisplayName: string = ecosystemSelection
    ? 'Bitcoin'
    : connector.name

  const handleBitcoinConnect = async () => {
    if (tagType === WalletTagType.Connected) {
      onConnected?.()
      return
    }

    try {
      const identityCheckPassed = isWalletInstalled(
        connector.id ?? connector.name
      )
      if (!identityCheckPassed) {
        onNotInstalled?.(connector)
        return
      }
      onConnecting?.()
      if (isConnected) {
        await disconnect()
      }
      await connect(connector.id ?? connector.name, (address: string) => {
        setLastConnectedAccount(connector)
        emitter.emit(WalletManagementEvent.WalletConnected, {
          address: address,
          chainId: ChainId.BTC,
          chainType: ChainType.UTXO,
          connectorId: connector.id ?? connector.name,
          connectorName: connector.name,
        })
      })
      onConnected?.()
    } catch (error) {
      onError?.(error)
    }
  }

  return (
    <CardListItemButton
      key={connector.id}
      icon={
        ecosystemSelection
          ? getChainTypeIcon(ChainType.UTXO)
          : (getConnectorIcon(connector) ?? '')
      }
      onClick={handleBitcoinConnect}
      title={connectorDisplayName}
      tagType={
        ecosystemSelection && tagType !== WalletTagType.Connected
          ? undefined
          : tagType
      }
    />
  )
}
