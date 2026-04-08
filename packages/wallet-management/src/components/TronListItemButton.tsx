import { ChainId, ChainType } from '@lifi/sdk'
import { useTronContext } from '@lifi/widget-provider'
import type { JSX } from 'react'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { getChainTypeIcon } from '../icons.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

export const TronListItemButton = ({
  ecosystemSelection,
  connector,
  tagType,
  onConnected,
  onConnecting,
  onError,
}: WalletListItemButtonProps): JSX.Element => {
  const emitter = useWalletManagementEvents()
  const { connect, disconnect, isConnected } = useTronContext()
  const connectorDisplayName = ecosystemSelection ? 'Tron' : connector.name
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectWallet = async () => {
    if (tagType === WalletTagType.Connected) {
      onConnected?.()
      return
    }

    try {
      onConnecting?.()
      if (isConnected) {
        await disconnect()
      }
      await connect(connector.id ?? connector.name, (address: string) => {
        setLastConnectedAccount(connector)
        emitter.emit(WalletManagementEvent.WalletConnected, {
          address: address,
          chainId: ChainId.TRN,
          chainType: ChainType.TVM,
          connectorId: connector.id ?? connector.name,
          connectorName: connector.name,
        })
        onConnected?.()
      })
    } catch (error) {
      onError?.(error)
    }
  }

  return (
    <CardListItemButton
      key={connectorDisplayName}
      icon={
        ecosystemSelection
          ? getChainTypeIcon(ChainType.TVM)
          : (connector.icon ?? '')
      }
      onClick={connectWallet}
      title={connectorDisplayName}
      tagType={
        ecosystemSelection && tagType !== WalletTagType.Connected
          ? undefined
          : tagType
      }
    />
  )
}
