import { Box, Container } from '@mui/material';

import { styled } from '@mui/system';

export const TransactionContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'relative',
  background: '#FBFCFC',
});

export const TransactionBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

export const TransactionFooter = styled(Box)(({ theme }) => ({
  width: '100%',
  background: 'white',
  position: 'absolute',
  bottom: 0,
  boxShadow: '0px 16px 64px rgba(0, 0, 0, 0.1)',
}));
