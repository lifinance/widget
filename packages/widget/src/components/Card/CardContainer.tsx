import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isError',
})<{ isError?: boolean }>(({ theme, isError }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid`,
  borderColor: isError
    ? theme.palette.error.main
    : theme.palette.mode === 'light'
    ? theme.palette.grey[300]
    : theme.palette.grey[800],
  borderRadius: (theme.shape.borderRadius as number) * 2,
  overflow: 'hidden',
  position: 'relative',
}));
