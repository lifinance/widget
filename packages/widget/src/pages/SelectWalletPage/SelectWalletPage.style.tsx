import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { listItemTextClasses } from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils/colors';

export const WalletListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(1.5),
  height: 64,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
}));

export const WalletListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  [`.${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
}));

export const WalletListItemText = styled(ListItemText)(({ theme }) => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 400,
  },
}));

export const WalletIdentityPopoverContent = styled(Typography)({
  maxWidth: 400,
});
