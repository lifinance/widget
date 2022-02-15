import { ListItem, ListItemButton } from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { styled } from '@mui/material/styles';

export const TokenListItemButton = styled(ListItemButton)({
  borderRadius: 8,
  paddingLeft: 12,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
});

export const TokenListItem = styled(ListItem)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  padding: 12,
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: 24,
  },
});
