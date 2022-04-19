import { Box, Container } from '@mui/material';
import { styled } from '@mui/system';

export const FormContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'relative',
});

export const FormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));
