import { ChainId, ChainType } from '@lifi/sdk'
import type { WalletConnector as SolanaWalletConnector } from '@solana/client-core'
import {
  useConnectWallet,
  useDisconnectWallet,
  useWallet,
  useWalletSession,
} from '@solana/react-hooks'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { getChainTypeIcon } from '../icons.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

interface SVMListItemButtonProps extends WalletListItemButtonProps {
  connector: SolanaWalletConnector
}

export const SVMListItemButton = ({
  ecosystemSelection,
  connector,
  tagType,
  onConnected,
  onConnecting,
  onError,
}: SVMListItemButtonProps) => {
  const connectorName = connector.name
  const emitter = useWalletManagementEvents()

  const connectWallet = useConnectWallet()
  const disconnectWallet = useDisconnectWallet()
  const { status } = useWallet()

  const { setLastConnectedAccount } = useLastConnectedAccount()
  const session = useWalletSession()

  const connectorDisplayName: string = ecosystemSelection
    ? 'Solana'
    : connector.name

  const handleConnectWallet = async () => {
    if (tagType === WalletTagType.Connected) {
      onConnected?.()
      return
    }

    try {
      onConnecting?.()
      if (status === 'connected') {
        await disconnectWallet()
      }
      await connectWallet(connectorName)

      if (session) {
        setLastConnectedAccount(connector)
        emitter.emit(WalletManagementEvent.WalletConnected, {
          address: session.account.address,
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          connectorId: connectorName,
          connectorName: connectorName,
        })
        onConnected?.()
      }
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
          : connector?.icon || ''
      }
      onClick={handleConnectWallet}
      title={connectorDisplayName}
      tagType={
        ecosystemSelection && tagType !== WalletTagType.Connected
          ? undefined
          : tagType
      }
    />
  )
}
