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
  type ConnectedWallet,
  useConnectWallet,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth'
import { useWallets as useSolanaWallets } from '@privy-io/react-auth/solana'
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

  // get active addresses
  const { address: activeEthAddress } = useAccount()
  const { publicKey: activeSolanaAddress } = useWallet()

  const handleLogout = () => {
    logout()
    disconnect()
    emitter.emit('disconnect')
  }

  const handleSetActiveEthWallet = async (wallet: ConnectedWallet) => {
    if (wallet.address === activeEthAddress) {
      return
    }
    return setActiveWallet(wallet)
  }

  const handleSetActiveSolanaWallet = (walletName: string) => {
    emitter.emit('connect', walletName)
  }

  const isActiveEthWallet = (wallet: ConnectedWallet) => {
    return wallet.address === activeEthAddress
  }

  const isActiveSolanaWallet = (address: string) => {
    return address === activeSolanaAddress?.toBase58()
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
          wallets.map((wallet) => {
            return (
              <MenuItem
                key={wallet.address}
                disabled={isActiveEthWallet(wallet)}
                onClick={() => handleSetActiveEthWallet(wallet)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <WalletIcon />
                </ListItemIcon>
                <ListItemText
                  primary={shortenAddress(wallet.address)}
                  secondary={isActiveEthWallet(wallet) ? 'Active' : null}
                />
              </MenuItem>
            )
          })}
        {solanaWallets.map((wallet) => {
          return (
            <MenuItem
              key={wallet.address}
              disabled={isActiveSolanaWallet(wallet.address)}
              onClick={() =>
                handleSetActiveSolanaWallet(wallet.standardWallet.name)
              }
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <WalletIcon />
              </ListItemIcon>
              <ListItemText
                primary={shortenAddress(wallet.address)}
                secondary={
                  isActiveSolanaWallet(wallet.address) ? 'Active' : null
                }
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
