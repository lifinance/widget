import { Avatar, styled } from '@mui/material';

export const PreviewAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 96,
  height: 96,
  borderRadius: theme.shape.borderRadius,
}));
