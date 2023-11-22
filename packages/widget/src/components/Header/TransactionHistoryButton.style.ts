import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';

export const HistoryIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadiusSecondary,
}));
