import { styled } from '@mui/material'
import type React from 'react'
import { ListItemButton as ListItemButtonBase } from '../ListItemButton.js'

export const ListItemButton: React.FC<
  React.ComponentProps<typeof ListItemButtonBase>
> = styled(ListItemButtonBase)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  height: 64,
  width: '100%',
}))
