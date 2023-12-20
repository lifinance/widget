import type { IconButtonProps, LinkProps } from '@mui/material';
import {
  IconButton as MuiIconButton,
  ListItem as MuiListItem,
} from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { listItemTextClasses } from '@mui/material/ListItemText';
import { alpha, styled } from '@mui/material/styles';
import { ListItemButton as ListItemButtonBase } from '../ListItemButton';

export const ListItemButton = styled(ListItemButtonBase)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  height: 64,
  width: '100%',
}));

export const ListItem = styled(MuiListItem)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: 64,
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(0, 1.5),
  [`.${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
  [`& .${listItemTextClasses.secondary}`]: {
    fontSize: 12,
    fontWeight: 500,
  },
  [`& .${listItemTextClasses.primary}, & .${listItemTextClasses.secondary}`]: {
    lineHeight: 1.3334,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

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
    borderRadius: '50%',
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? alpha(theme.palette.common.black, 0.04)
          : alpha(theme.palette.common.white, 0.08),
    },
    svg: {
      fontSize: 14,
    },
  }),
);
