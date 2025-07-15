import {
  listItemSecondaryActionClasses,
  ListItem as MuiListItem,
  ListItemButton as MuiListItemButton,
  styled,
} from '@mui/material'

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: theme.vars.shape.borderRadius,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  height: 64,
  '&:hover': {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  },
}))

export const ListItem = styled(MuiListItem, {
  shouldForwardProp: (prop) => prop !== 'disableRipple',
})(({ theme }) => ({
  padding: theme.spacing(0),
  [`.${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
  '&:hover': {
    cursor: 'pointer',
  },
}))
