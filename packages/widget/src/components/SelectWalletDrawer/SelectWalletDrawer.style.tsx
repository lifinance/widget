import { ListItem, ListItemButton } from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { styled } from '@mui/material/styles';

export const WalletListItemButton = styled(ListItemButton)({
  borderRadius: 8,
  paddingLeft: 12,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
});

export const WalletListItem = styled(ListItem)({
  width: '100%',
  padding: 12,
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: 24,
  },
});
