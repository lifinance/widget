import { IconButton, styled } from '@mui/material'

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  backgroundColor: theme.vars.palette.background.paper,
  width: 24,
  height: 24,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.background.paper,
  }),
}))

export const RetryButton = styled(IconButton)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 12,
  height: 24,
  minWidth: 'auto',
  borderRadius: theme.vars.shape.borderRadius,
  padding: theme.spacing(0.5, 1.5),
  color: theme.vars.palette.text.primary,
  backgroundColor: theme.vars.palette.background.paper,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.background.paper,
  }),
}))
