import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const MockElement = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  height: 48,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))
