import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { usePrivy } from '@privy-io/react-auth'
import { useDisconnect } from 'wagmi'
import { shortenAddress } from '../utils/account'

export function AccountBalance() {
  const { user, logout } = usePrivy()
  const { disconnect } = useDisconnect()

  const handleLogout = () => {
    logout()
    disconnect()
  }

  if (!user?.wallet?.address) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Button
        type="button"
        variant="outlined"
        sx={{
          borderRadius: 6,
          p: 1,
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
