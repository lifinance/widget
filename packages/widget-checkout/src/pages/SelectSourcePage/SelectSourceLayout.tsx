import { Box, styled, Typography } from '@mui/material'

export const SelectSourceHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}))

export const SelectSourceHeaderTitle = styled(Typography)({
  flex: 1,
  textAlign: 'center',
  fontWeight: 700,
  fontSize: 18,
  lineHeight: '24px',
})

export const SelectSourceMainColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  width: '100%',
}))
