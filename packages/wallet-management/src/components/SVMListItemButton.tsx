import { ChainId, ChainType } from '@lifi/sdk'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

interface SVMListItemButtonProps extends WalletListItemButtonProps {
  walletAdapter: WalletAdapter
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
  const { select, disconnect, connected } = useWallet()
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
      if (connected) {
        await disconnect()
      }
      select(walletAdapter.name)
      // We use autoConnect on wallet selection
      // await connect()
      walletAdapter.once('connect', (publicKey: PublicKey) => {
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
          ? 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/solana.svg'
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
