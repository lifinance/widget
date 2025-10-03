import { ChainId, ChainType } from '@lifi/sdk'
import { useSVMContext } from '@lifi/wallet-provider'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { getChainTypeIcon } from '../icons.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

interface SVMListItemButtonProps extends WalletListItemButtonProps {
  walletAdapter: any
}

export const SVMListItemButton = ({
  ecosystemSelection,
  walletAdapter,
  tagType,
  onConnected,
  onConnecting,
  onError,
}: SVMListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const { connect, disconnect, isConnected } = useSVMContext()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorName = walletAdapter.name
  const connectorDisplayName: string = ecosystemSelection
    ? 'Solana'
    : walletAdapter.name

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
      connect(walletAdapter.name)
      walletAdapter.once('connect', (publicKey: any) => {
        setLastConnectedAccount(walletAdapter)
        emitter.emit(WalletManagementEvent.WalletConnected, {
          address: publicKey?.toString(),
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          connectorId: connectorName,
          connectorName: connectorName,
        })
      })
      onConnected?.()
    } catch (error) {
      onError?.(error)
    }
  }

  return (
    <CardListItemButton
      key={connectorDisplayName}
      icon={
        ecosystemSelection
          ? getChainTypeIcon(ChainType.SVM)
          : walletAdapter.icon
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
