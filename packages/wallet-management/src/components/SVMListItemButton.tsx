import { ChainId, ChainType } from '@lifi/sdk'
import { Avatar, ListItemAvatar } from '@mui/material'
import { type UiWallet, useConnect } from '@wallet-standard/react'
import { ListItemButton } from '../components/ListItemButton.js'
import { ListItemText } from '../components/ListItemText.js'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { WalletManagementEvent } from '../types/events.js'
import type { WalletListItemButtonProps } from './types.js'

interface SVMListItemButtonProps extends WalletListItemButtonProps {
  wallet: UiWallet
}

export const SVMListItemButton = ({
  ecosystemSelection,
  wallet,
  onConnected,
  onConnecting,
  onError,
}: SVMListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const [, connect] = useConnect(wallet)

  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorName = wallet.name
  const connectorDisplayName: string = ecosystemSelection
    ? 'Solana'
    : wallet.name

  const connectWallet = async () => {
    try {
      onConnecting?.()

      const accounts = await connect()

      setLastConnectedAccount(wallet)
      emitter.emit(WalletManagementEvent.WalletConnected, {
        address: accounts[0].address,
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
        connectorId: connectorName,
        connectorName: connectorName,
      })
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
              ? 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/solana.svg'
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
