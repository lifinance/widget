import type { ChainType } from '@lifi/sdk'
import type { Adapter as TronWalletAdapter } from '@tronweb3/tronwallet-abstract-adapter'
import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import { startTransition } from 'react'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { getChainTypeIcon } from '../icons.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

interface TronListItemButtonProps extends WalletListItemButtonProps {
  connector: TronWalletAdapter
}

export const TronListItemButton = ({
  ecosystemSelection,
  connector,
  tagType,
  onConnected,
  onConnecting,
  onError,
}: TronListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const { connected, connect, disconnect, select } = useTronWallet()
  const connectorDisplayName = ecosystemSelection ? 'Tron' : connector.name
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectWallet = async () => {
    if (tagType === WalletTagType.Connected) {
      onConnected?.()
      return
    }

    try {
      onConnecting?.()
      if (connected) {
        await disconnect()
      }
      select(connector.name)
      startTransition(async () => {
        await connect()
        connector.once('connect', (address: string) => {
          setLastConnectedAccount(connector)
          emitter.emit(WalletManagementEvent.WalletConnected, {
            address,
            chainId: 728126428,
            chainType: 'TVM' as ChainType,
            connectorId: connector.name,
            connectorName: connector.name,
          })
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
          ? getChainTypeIcon('TVM' as ChainType)
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
