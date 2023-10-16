import styled from '@emotion/styled';
import { Alert, Container } from '@mui/material';

export const PageContainer = styled(Container)(({ theme }) => ({
  height: 508,
  display: 'flex',
  flexDirection: 'column',
}));

export const AlertSection = styled(Alert)(({ theme }) => ({
  marginTop: 'auto',
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  '.MuiAlert-icon': {
    color: theme.palette.grey[700],
  },
  marginBottom: theme.spacing(2),
}));
