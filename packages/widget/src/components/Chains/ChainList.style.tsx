import {
  ListItem as ListItemBase,
  listItemButtonClasses,
  listItemTextClasses,
  Avatar as MuiAvatar,
  List as MuiList,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText as MuiListItemText,
  styled,
} from '@mui/material'
import { ListItemButton as ListItemButtonBase } from '../ListItemButton.js'

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
    fontSize: size === 'small' ? '1rem' : '1.125rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}))

export const ListItemButton = styled(ListItemButtonBase)<{
  size?: 'small' | 'medium'
}>(({ size = 'medium', theme }) => {
  return {
    borderRadius: theme.vars.shape.borderRadius,
    paddingLeft: size === 'small' ? theme.spacing(1) : theme.spacing(1.5),
    height: size === 'small' ? 44 : 56,
    width: '100%',
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

export const ListItem = styled(ListItemBase)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  [`& .${listItemButtonClasses.root}`]: {
    paddingRight: theme.spacing(1),
  },
}))
