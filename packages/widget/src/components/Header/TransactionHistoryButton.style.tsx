import { Badge, Box, styled } from '@mui/material'

export const ErrorBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    padding: 0,
    minWidth: 'unset',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: 'white',
    top: '0px',
    left: '8px',
  },
})

export const ProgressContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
