import { ChainId, ChainType } from '@lifi/sdk'
import { isWalletInstalled, useUTXOContext } from '@lifi/wallet-provider'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { getChainTypeIcon } from '../icons.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

export const UTXOListItemButton = ({
  ecosystemSelection,
  connector,
  tagType,
  onNotInstalled,
  onConnected,
  onConnecting,
  onError,
}: WalletListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const { connect, disconnect, isConnected } = useUTXOContext()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorDisplayName: string = ecosystemSelection
    ? 'Bitcoin'
    : connector.name

  const handleUTXOConnect = async () => {
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
      onClick={handleUTXOConnect}
      title={connectorDisplayName}
      tagType={
        ecosystemSelection && tagType !== WalletTagType.Connected
          ? undefined
          : tagType
      }
    />
  )
}
