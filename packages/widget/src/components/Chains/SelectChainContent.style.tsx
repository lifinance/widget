import {
  Avatar as MuiAvatar,
  List as MuiList,
  ListItemAvatar as MuiListItemAvatar,
  ListItemButton as MuiListItemButton,
  ListItemText as MuiListItemText,
  listItemTextClasses,
  styled,
} from '@mui/material'

export const Avatar = styled(MuiAvatar)<{
  size?: 'small' | 'regular'
}>(({ size = 'regular' }) => ({
  width: size === 'small' ? 32 : 40,
  height: size === 'small' ? 32 : 40,
}))

export const ListItemAvatar = styled(MuiListItemAvatar)<{
  size?: 'small' | 'regular'
}>(({ size = 'regular' }) => ({
  minWidth: size === 'small' ? 44 : 56,
}))

export const ListItemText = styled(MuiListItemText)<{
  size?: 'small' | 'regular'
}>(({ size = 'regular' }) => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 500,
    fontSize: size === 'small' ? '0.875rem' : '1.125rem',
  },
}))

export const ListItemButton = styled(MuiListItemButton)<{
  size?: 'small' | 'regular'
}>(({ size, theme }) => {
  return {
    borderRadius: size === 'small' ? 8 : theme.vars.shape.borderRadius,
    paddingLeft: size === 'small' ? theme.spacing(1) : theme.spacing(1.5),
    height: size === 'small' ? 44 : 56,
    '&:hover': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    },
    '&.Mui-selected': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
      '&:hover': {
        backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
      },
    },
  }
})

export const List = styled(MuiList)<{
  size?: 'small' | 'regular'
}>(({ size, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  paddingTop: 0,
  paddingLeft: theme.spacing(size === 'small' ? 3 : 1.5),
  paddingRight: theme.spacing(size === 'small' ? 3 : 1.5),
  paddingBottom: theme.spacing(1.5),
  cursor: 'pointer',
}))
