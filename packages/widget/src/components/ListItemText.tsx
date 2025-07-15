import {
  listItemTextClasses,
  ListItemText as MuiListItemText,
  styled,
} from '@mui/material'

export const ListItemText = styled(MuiListItemText)(() => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 500,
  },
}))
