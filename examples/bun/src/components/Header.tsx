import { Box, Typography } from '@mui/material'

export function Header() {
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
        LI.FI + Bun + Vite Example
      </Typography>
    </Box>
  )
}
