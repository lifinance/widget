import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth'
import { useEffect } from 'react'
import { useDisconnect } from 'wagmi'
import { emitter } from '../providers/SolanaProvider'
import { shortenAddress } from '../utils/account'

export function AccountBalance() {
  const { user, logout } = usePrivy()
  const { disconnect } = useDisconnect()
  const { wallets: solanaWallets } = useSolanaWallets()

  const handleLogout = () => {
    logout()
    disconnect()
    emitter.emit('disconnect')
  }

  useEffect(() => {
    if (!user?.wallet) {
      return
    }
    const { wallet } = user

    if (wallet.chainType === 'solana') {
      const activeSolanaWallet = solanaWallets.find(
        (solanaWallet) => solanaWallet.address === wallet.address
      )
      if (activeSolanaWallet) {
        emitter.emit('connect', activeSolanaWallet.meta.name)
      }
    }
  }, [user, solanaWallets])

  if (!user?.wallet?.address) {
    return null
  }

  return (
    <Box display="flex" gap={2}>
      <Button
        type="button"
        variant="outlined"
        sx={{
          borderRadius: 6,
          p: 1,
          borderColor: 'black',
          color: 'black',
        }}
      >
        {shortenAddress(user.wallet.address)}
      </Button>
      <Button
        type="button"
        onClick={handleLogout}
        variant="contained"
        sx={{
          borderRadius: 6,
          backgroundColor: 'black',
        }}
      >
        Logout
      </Button>
    </Box>
  )
}
