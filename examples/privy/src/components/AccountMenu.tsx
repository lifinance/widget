import Logout from '@mui/icons-material/Logout'
import PersonAdd from '@mui/icons-material/PersonAdd'
import WalletIcon from '@mui/icons-material/Wallet'
import {
  Divider,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  type ConnectedSolanaWallet,
  type ConnectedWallet,
  useConnectWallet,
  usePrivy,
  useSolanaWallets,
  useWallets,
} from '@privy-io/react-auth'
import { useSetActiveWallet } from '@privy-io/wagmi'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccount, useDisconnect } from 'wagmi'
import { emitter } from '../providers/SolanaProvider'
import { shortenAddress } from '../utils/account'

type AccountMenuProps = {
  handleClose: () => void
  anchorEl: HTMLElement | null
  open: boolean
}

type ConnectedWalletType = ConnectedSolanaWallet | ConnectedWallet

export function AccountMenu({ handleClose, anchorEl, open }: AccountMenuProps) {
  const { user, logout, ready } = usePrivy()
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      if (wallet.type === 'solana') {
        emitter.emit('connect', wallet.meta.name)
      }
    },
  })
  const { wallets, ready: walletsReady } = useWallets()
  const { address: activeEthAddress } = useAccount()
  const { wallets: solanaWallets } = useSolanaWallets()
  const { setActiveWallet } = useSetActiveWallet()
  const { publicKey: activeSolanaAddress } = useWallet()

  const allWallets = [...wallets, ...solanaWallets]

  const { disconnect } = useDisconnect()

  const handleLogout = () => {
    logout()
    disconnect()
    emitter.emit('disconnect')
  }

  const handleSetActiveWallet = async (wallet: ConnectedWalletType) => {
    if (wallet.type === 'ethereum') {
      return setActiveWallet(wallet)
    }
    if (wallet.type === 'solana') {
      return emitter.emit('connect', wallet.meta.name)
    }
  }

  const isActiveWallet = (wallet: ConnectedWalletType) => {
    if (wallet.type === 'ethereum') {
      return wallet.address === activeEthAddress
    }
    if (wallet.type === 'solana') {
      return wallet.address === activeSolanaAddress?.toBase58()
    }
  }

  if (!user?.id || !ready) {
    return null
  }
  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <ListSubheader>Wallets</ListSubheader>
      {walletsReady &&
        allWallets.map((wallet) => {
          return (
            <MenuItem
              key={wallet.address}
              disabled={isActiveWallet(wallet)}
              onClick={() => handleSetActiveWallet(wallet)}
            >
              <ListItemIcon>
                <WalletIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={shortenAddress(wallet.address)}
                secondary={isActiveWallet(wallet) ? 'Active' : null}
              />
            </MenuItem>
          )
        })}

      <Divider />
      <MenuItem onClick={connectWallet}>
        <ListItemIcon>
          <PersonAdd fontSize="small" />
        </ListItemIcon>
        Connect another wallet
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )
}
