import {
  ListItem as MuiListItem,
  ListItemButton as MuiListItemButton,
} from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { styled } from '@mui/material/styles';

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
}));

export const ListItem = styled(MuiListItem)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  padding: theme.spacing(1.5),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
}));
