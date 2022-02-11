import { ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TokenListItemButton = styled(ListItemButton)({
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
});
