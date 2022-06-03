import { Box, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RouteExecutionStatus } from '../../hooks';

const getStatusColor = (status: RouteExecutionStatus, theme: Theme) => {
  switch (status) {
    case 'success':
      return theme.palette.success.main;
    case 'error':
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
};

export const IconContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
}));

export const IconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: RouteExecutionStatus }>(({ theme, status }) => ({
  border: `3px solid ${getStatusColor(status, theme)}`,
  borderRadius: '50%',
  width: 64,
  height: 64,
  display: 'grid',
  position: 'relative',
  placeItems: 'center',
}));

export const iconStyles = {
  position: 'absolute',
  fontSize: '2.5rem',
};
