import { IconButton, styled } from '@mui/material';

export const CloseButtonLayout = styled(IconButton)(() => ({
  position: 'absolute',
  top: '12px',
  right: '26px',
  zIndex: 1,
  height: '40px',
  width: '40px',
  alignItems: 'center',
  justifyContent: 'center',
}));
