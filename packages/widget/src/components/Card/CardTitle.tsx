import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  lineHeight: '1.286',
  letterSpacing: '0.01071em',
  fontWeight: 'bold',
  padding: theme.spacing(1.75, 2, 0, 2),
}));
