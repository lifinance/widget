import { Box, Typography } from '@mui/material'

export const ProgressPage: React.FC = () => {
  return (
    <Box sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" gutterBottom>
        Purchase in progress
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This screen follows a successful cash on-ramp (Transak placeholder).
        Harden callbacks and status polling in a follow-up.
      </Typography>
    </Box>
  )
}
