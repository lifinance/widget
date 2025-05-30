import { Box, Typography } from '@mui/material'
import { ConnectKitButton } from 'connectkit'

export function WalletHeader() {
  return (
    <Box
      p={2}
      mb={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid #EEE"
    >
      <Typography px={2} fontWeight={600} fontSize={24}>
        LI.FI Widget + Family ConnectKit Example
      </Typography>
      <Box display="flex" alignItems="center">
        <ConnectKitButton />
      </Box>
    </Box>
  )
}
