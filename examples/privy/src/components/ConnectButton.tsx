import { Box, Button } from '@mui/material'
import { usePrivy } from '@privy-io/react-auth'

export function ConnectButton() {
  const { login } = usePrivy()

  return (
    <Box display="flex" gap={2}>
      <Button
        type="button"
        onClick={login}
        variant="contained"
        sx={{
          borderRadius: 6,
          backgroundColor: 'black',
        }}
      >
        Login
      </Button>
    </Box>
  )
}
