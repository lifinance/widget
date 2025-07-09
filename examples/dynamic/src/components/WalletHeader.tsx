import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { Box, Typography } from '@mui/material'

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
        Dynamic + LI.FI widget Example
      </Typography>
      <Box display="flex" alignItems="center">
        <DynamicWidget />
      </Box>
    </Box>
  )
}
