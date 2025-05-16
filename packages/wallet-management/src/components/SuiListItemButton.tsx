import { ChainId, ChainType } from '@lifi/sdk'
import { Avatar, ListItemAvatar } from '@mui/material'
import { useConnectWallet } from '@mysten/dapp-kit'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { WalletManagementEvent } from '../types/events.js'
import { ListItemButton } from './ListItemButton.js'
import { ListItemText } from './ListItemText.js'
import type { WalletListItemButtonProps } from './types.js'

interface SuiListItemButtonProps extends WalletListItemButtonProps {
  wallet: WalletWithRequiredFeatures
}

export const SuiListItemButton = ({
  ecosystemSelection,
  wallet,
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
    <ListItemButton key={connectorDisplayName} onClick={connectWallet}>
      <ListItemAvatar>
        <Avatar
          src={
            ecosystemSelection
              ? 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/sui.svg'
              : wallet.icon
          }
          alt={connectorDisplayName}
        >
          {connectorDisplayName[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={connectorDisplayName} />
    </ListItemButton>
  )
}
