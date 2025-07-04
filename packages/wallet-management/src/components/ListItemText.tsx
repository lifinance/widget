import {
  ListItemText as MuiListItemText,
  listItemTextClasses,
  styled,
} from '@mui/material'

export const ListItemText = styled(MuiListItemText)(() => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 600,
    fontSize: 16,
  },
}))
