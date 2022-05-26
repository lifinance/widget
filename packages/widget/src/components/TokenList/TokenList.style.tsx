import {
  ListItem as MuiListItem,
  ListItemButton as MuiListItemButton,
} from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils/colors';

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(2),
  height: 64,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
}));

export const ListItem = styled(MuiListItem)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  padding: theme.spacing(0.5, 3),
  [`.${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(5),
  },
}));
