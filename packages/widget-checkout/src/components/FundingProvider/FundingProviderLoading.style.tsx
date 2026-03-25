import { Box, styled } from '@mui/material'

export const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  flex: 1,
  minHeight: 300,
}))

export const MessageBlock = styled(Box)({
  textAlign: 'center',
})
