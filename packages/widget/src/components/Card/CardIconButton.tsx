import type { IconButtonProps, LinkProps } from '@mui/material'
import { IconButton as MuiIconButton, styled } from '@mui/material'
import type React from 'react'

export const CardIconButton: React.FC<
  React.ComponentProps<typeof MuiIconButton> &
    IconButtonProps &
    Pick<LinkProps, 'href' | 'target' | 'rel'>
> = styled(MuiIconButton)<
  IconButtonProps & Pick<LinkProps, 'href' | 'target' | 'rel'>
>(({ theme }) => {
  return {
    padding: theme.spacing(0.5),
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
    },
    fontSize: '1rem',
  }
})
