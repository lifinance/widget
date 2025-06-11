import { styled } from '@mui/material'
import { ListItemButton as ListItemButtonBase } from '../ListItem/ListItemButton.js'

export const ListItemButton = styled(ListItemButtonBase)(({ theme }) => {
  return {
    height: 60,
    marginBottom: theme.spacing(1),
  }
})
