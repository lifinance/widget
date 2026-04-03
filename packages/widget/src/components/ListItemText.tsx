import {
  listItemTextClasses,
  ListItemText as MuiListItemText,
  styled,
} from '@mui/material'
import type React from 'react'

export const ListItemText: React.FC<
  React.ComponentProps<typeof MuiListItemText>
> = styled(MuiListItemText)(() => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 500,
  },
}))
