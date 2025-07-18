import { ChainId, ChainType } from '@lifi/sdk'
import { useConnectWallet } from '@mysten/dapp-kit'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { getChainTypeIcon } from '../icons.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

interface SuiListItemButtonProps extends WalletListItemButtonProps {
  wallet: WalletWithRequiredFeatures
}

export const SuiListItemButton = ({
  ecosystemSelection,
  wallet,
  tagType,
  onConnected,
  onConnecting,
  onError,
}: SuiListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const { mutateAsync: connect } = useConnectWallet()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorName = wallet.name
  const connectorDisplayName: string = ecosystemSelection ? 'Sui' : wallet.name

  const connectWallet = async () => {
    if (tagType === WalletTagType.Connected) {
      onConnected?.()
      return
    }

    try {
      onConnecting?.()
      await connect(
        { wallet },
        {
          onSuccess: (standardConnectOutput) => {
            setLastConnectedAccount(wallet)
            emitter.emit(WalletManagementEvent.WalletConnected, {
              address: standardConnectOutput.accounts[0].address,
              chainId: ChainId.SOL,
              chainType: ChainType.SVM,
              connectorId: connectorName,
              connectorName: connectorName,
            })
          },
        }
      )
      onConnected?.()
    } catch (error) {
      onError?.(error)
    }
  }

  return (
    <CardListItemButton
      key={connectorDisplayName}
      icon={ecosystemSelection ? getChainTypeIcon(ChainType.MVM) : wallet.icon}
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
