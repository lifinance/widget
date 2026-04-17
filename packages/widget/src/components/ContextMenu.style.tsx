import { IconButton, styled } from '@mui/material'
import type React from 'react'

export const ContextMenuButton: React.FC<
  React.ComponentProps<typeof IconButton>
> = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.75),
  right: theme.spacing(2),
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  },
}))
