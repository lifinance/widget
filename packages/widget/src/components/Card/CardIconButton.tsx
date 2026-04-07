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
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    '&:hover': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    },
    fontSize: '1rem',
  }
})
