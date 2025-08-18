import AddLinkIcon from '@mui/icons-material/AddLink'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import FingerPrintIcon from '@mui/icons-material/FingerPrint'
import Logout from '@mui/icons-material/Logout'
import WalletIcon from '@mui/icons-material/Wallet'
import {
  Divider,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  MenuList,
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
import { emitter } from '../providers/SolanaProvider.js'
import { shortenAddress } from '../utils/account.js'

type AccountMenuProps = {
  handleClose: () => void
  anchorEl: HTMLElement | null
  open: boolean
}

type ConnectedWalletType = ConnectedSolanaWallet | ConnectedWallet

export function AccountMenu({ handleClose, anchorEl, open }: AccountMenuProps) {
  const { user, logout, ready, linkEmail, linkPasskey } = usePrivy()

  // manage user wallets
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      if (wallet.type === 'solana') {
        emitter.emit('connect', wallet.meta.name)
      }
    },
  })
  const { setActiveWallet } = useSetActiveWallet()
  const { disconnect } = useDisconnect()

  // get user wallets
  const { wallets, ready: walletsReady } = useWallets()
  const { wallets: solanaWallets } = useSolanaWallets()
  const allWallets = [...wallets, ...solanaWallets]

  // get active addresses
  const { address: activeEthAddress } = useAccount()
  const { publicKey: activeSolanaAddress } = useWallet()

  const handleLogout = () => {
    logout()
    disconnect()
    emitter.emit('disconnect')
  }

  const handleSetActiveWallet = async (wallet: ConnectedWalletType) => {
    if (isActiveWallet(wallet)) {
      return
    }
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

  const userHasPassKey = user?.linkedAccounts?.find(
    (account) => account.type === 'passkey'
  )

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
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuList>
        <ListSubheader>Wallets</ListSubheader>
        {walletsReady &&
          allWallets.map((wallet) => {
            return (
              <MenuItem
                key={wallet.address}
                disabled={isActiveWallet(wallet)}
                onClick={() => handleSetActiveWallet(wallet)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <WalletIcon />
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
            <AddLinkIcon fontSize="small" />
          </ListItemIcon>
          Connect another wallet
        </MenuItem>
        {!user.email && (
          <MenuItem onClick={linkEmail}>
            <ListItemIcon>
              <AlternateEmailIcon fontSize="small" />
            </ListItemIcon>
            Link email
          </MenuItem>
        )}
        <MenuItem onClick={linkPasskey}>
          <ListItemIcon>
            <FingerPrintIcon fontSize="small" />
          </ListItemIcon>
          Link {userHasPassKey ? 'another' : 'a'} passkey
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
