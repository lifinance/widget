import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  overflow: 'hidden',
}));
