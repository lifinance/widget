import { ListItem, ListItemButton, Typography } from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { styled } from '@mui/material/styles';

export const WalletListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
}));

export const WalletListItem = styled(ListItem)(({ theme }) => ({
  height: '60px',
  width: '100%',
  padding: theme.spacing(1.5),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
}));

export const WalletIdentityPopoverContent = styled(Typography)({
  maxWidth: 400,
});
