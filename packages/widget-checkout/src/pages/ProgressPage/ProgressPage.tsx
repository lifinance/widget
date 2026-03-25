import { Box, Typography } from '@mui/material'

export const ProgressPage: React.FC = () => {
  return (
    <Box sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" gutterBottom>
        Purchase in progress
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This screen can follow a successful cash on-ramp once Transak iframe
        postMessage handling is wired for order completion.
      </Typography>
    </Box>
  )
}
