import { Badge, Box, CircularProgress, styled } from '@mui/material'

export const ErrorBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    padding: 0,
    minWidth: 'unset',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: theme.vars.palette.background.paper,
    top: 0,
    left: 8,
  },
}))

export const ProgressContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const ProgressTrack = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
}))

export const ProgressFill = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.primary.main,
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.primary.light,
  }),
}))
