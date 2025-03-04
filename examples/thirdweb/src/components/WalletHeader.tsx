import { Box, Typography } from '@mui/material'
import { ConnectButton } from 'thirdweb/react'
import { client } from '../config/thirdweb'

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
        LI.FI Widget + Thirdweb Example
      </Typography>
      <Box display="flex" alignItems="center">
        <ConnectButton client={client} />
      </Box>
    </Box>
  )
}
