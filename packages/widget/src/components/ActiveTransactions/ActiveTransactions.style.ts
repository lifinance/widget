import {
  Button,
  ListItem as MuiListItem,
  ListItemButton as MuiListItemButton,
  listItemSecondaryActionClasses,
  styled,
} from '@mui/material';
import { getContrastAlphaColor } from '../../utils/colors.js';

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  height: 64,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, 0.04),
  },
}));

export const ListItem = styled(MuiListItem, {
  shouldForwardProp: (prop) => prop !== 'disableRipple',
})(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  [`.${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
  '&:hover': {
    cursor: 'pointer',
  },
}));

export const ShowAllButton = styled(Button)(({ theme }) => ({
  background: 'none',
  '&:hover': {
    background: 'none',
  },
  padding: theme.spacing(0.75, 2),
  fontSize: '0.875rem',
}));
