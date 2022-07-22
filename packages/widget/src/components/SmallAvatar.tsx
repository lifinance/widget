import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 16,
  height: 16,
  border: `2px solid ${theme.palette.background.paper}`,
}));
