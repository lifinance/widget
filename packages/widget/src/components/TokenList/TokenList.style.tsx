import type { IconButtonProps, LinkProps } from '@mui/material'
import {
  IconButton as MuiIconButton,
  List as MuiList,
  styled,
} from '@mui/material'
import { ListItem as ListItemBase } from '../ListItem/ListItem.js'

export const ListItem = styled(ListItemBase)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
}))

export const List = styled(MuiList)(({ theme }) => ({
  cursor: 'pointer',
  marginLeft: theme.spacing(1.5),
  marginRight: theme.spacing(1.5),
}))

export const IconButton = styled(MuiIconButton)<IconButtonProps & LinkProps>(
  ({ theme }) => ({
    lineHeight: 1,
    fontSize: 12,
    fontWeight: 400,
    padding: theme.spacing(0.375, 0.375),
    margin: theme.spacing(0, 0, 0, 0.25),
    color: 'inherit',
    backgroundColor: 'unset',
    minWidth: 'unset',
    borderRadius: theme.vars.shape.borderRadiusTertiary,
    '&:hover': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    },
    svg: {
      fontSize: 14,
    },
  })
)
