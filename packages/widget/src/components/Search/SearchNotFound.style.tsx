import { Box, styled, Typography } from '@mui/material';

export const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  flex: 1,
  padding: theme.spacing(3),
}));

export const NotFoundMessage = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.secondary,
  textAlign: 'center',
  flex: 1,
  marginTop: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const NotFoundIconContainer = styled(Typography)(({ theme }) => ({
  fontSize: 48,
  lineHeight: 1,
}));
