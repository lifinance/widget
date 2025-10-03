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
  const { connect, disconnect } = useUTXOContext()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorName = connector.name
  const connectorDisplayName: string = ecosystemSelection
    ? 'Bitcoin'
    : connectorName

  const handleUTXOConnect = async () => {
    if (tagType === WalletTagType.Connected) {
      onConnected?.()
      return
    }

    try {
      const identityCheckPassed = isWalletInstalled(connector.id)
      if (!identityCheckPassed) {
        onNotInstalled?.(connector)
        return
      }
      onConnecting?.()
      // Disconnect currently connected UTXO wallet (if any)
      await disconnect()
      const data = await connect(connector)
      setLastConnectedAccount(connector)
      emitter.emit(WalletManagementEvent.WalletConnected, {
        address: data.accounts[0].address,
        chainId: ChainId.BTC,
        chainType: ChainType.UTXO,
        connectorId: connector.id,
        connectorName: connectorName,
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
