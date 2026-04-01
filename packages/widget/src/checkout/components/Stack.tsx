import { Box, styled } from '@mui/material'

/** Shared column layout for checkout routes: gap, padding, flex growth. */
export const Stack = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'compact',
})<{ compact?: boolean }>(({ theme, compact }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(compact ? 2 : 3),
  flex: 1,
}))
