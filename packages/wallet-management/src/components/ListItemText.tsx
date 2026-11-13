import type { StyledComponent } from '@emotion/styled'
import {
  listItemTextClasses,
  type ListItemTextProps,
  ListItemText as MuiListItemText,
  styled,
} from '@mui/material'

export const ListItemText: StyledComponent<ListItemTextProps> = styled(
  MuiListItemText
)(() => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 600,
    fontSize: 16,
  },
}))
