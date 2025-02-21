import { Button } from '@mui/material'
import { usePrivy } from '@privy-io/react-auth'

export function ConnectButton() {
  const { login } = usePrivy()
  const handleLogin = () => {
    login()
  }

  return (
    <Button
      type="button"
      onClick={handleLogin}
      variant="contained"
      sx={{
        borderRadius: 6,
        backgroundColor: 'black',
      }}
    >
      Log in
    </Button>
  )
}
