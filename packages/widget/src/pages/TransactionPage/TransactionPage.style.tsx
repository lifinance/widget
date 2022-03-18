import { Box, Container } from '@mui/material';

import { styled } from '@mui/system';

export const TransactionContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  background: '#FBFCFC',
  height: 'calc(100% - 93px)',
});

export const TransactionBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

export const GrowableTransactionBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  flex: 1,
  overflowY: 'auto',
}));

export const TransactionFooter = styled(Box)(({ theme }) => ({
  width: '100%',
  background: 'white',
  flex: '0 0 auto',
  zIndex: 999,
  boxShadow: '0px 16px 64px rgba(0, 0, 0, 0.1)',
}));
