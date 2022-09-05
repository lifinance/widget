import {
  ListItemButton as MuiListItemButton,
  ListItemText as MuiListItemText,
} from '@mui/material';
import { listItemTextClasses } from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils';

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadiusSecondary,
  paddingLeft: theme.spacing(1.5),
  height: 56,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
}));

export const ListItemText = styled(MuiListItemText)(({ theme }) => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 400,
  },
}));
