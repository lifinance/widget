import { Badge, styled } from '@mui/material'

export const ErrorBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    padding: 0,
    minWidth: 'unset',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: theme.vars.palette.background.paper,
    boxShadow: `0 0 0 2px ${theme.vars.palette.background.paper}`,
    top: -2,
    left: 10,
  },
}))
