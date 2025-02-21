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
        LIFI widget + Reown AppKit Example
      </Typography>
      <Box display="flex" alignItems="center">
        {/* @ts-expect-error msg */}
        <appkit-button />
      </Box>
    </Box>
  )
}
