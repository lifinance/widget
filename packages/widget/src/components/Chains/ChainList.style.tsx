import {
  ListItem as ListItemBase,
  Avatar as MuiAvatar,
  List as MuiList,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText as MuiListItemText,
  listItemTextClasses,
  styled,
} from '@mui/material'
import { ListItemButton as ListItemButtonBase } from '../ListItem/ListItemButton.js'

export const Avatar = styled(MuiAvatar)<{
  size?: 'small' | 'medium'
}>(({ size = 'medium' }) => ({
  width: size === 'small' ? 32 : 40,
  height: size === 'small' ? 32 : 40,
}))

export const ListItemAvatar = styled(MuiListItemAvatar)<{
  size?: 'small' | 'medium'
}>(({ size = 'medium' }) => ({
  minWidth: size === 'small' ? 44 : 56,
}))

export const ListItemText = styled(MuiListItemText)<{
  size?: 'small' | 'medium'
}>(({ size = 'medium' }) => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 500,
    fontSize: size === 'small' ? '0.875rem' : '1.125rem',
  },
}))

export const ListItemButton = styled(ListItemButtonBase)<{
  size?: 'small' | 'medium'
}>(({ size = 'medium', theme }) => {
  return {
    borderRadius:
      size === 'small' && theme.vars.shape.borderRadius
        ? `calc(${theme.vars.shape.borderRadius} / 2)`
        : theme.vars.shape.borderRadius,
    paddingLeft: size === 'small' ? theme.spacing(1) : theme.spacing(1.5),
    height: size === 'small' ? 44 : 56,
  }
})

export const List = styled(MuiList)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: 0,
  marginLeft: theme.spacing(1.5),
  marginRight: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  cursor: 'pointer',
}))

export const ListItem = styled(ListItemBase)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
}))
