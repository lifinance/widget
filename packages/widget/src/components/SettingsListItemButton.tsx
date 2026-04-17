import { styled } from '@mui/material'
import type React from 'react'
import { ListItemButton as ListItemButtonBase } from './ListItemButton.js'

export const SettingsListItemButton: React.FC<
  React.ComponentProps<typeof ListItemButtonBase>
> = styled(ListItemButtonBase)(({ theme }) => ({
  paddingRight: theme.spacing(1),
}))
