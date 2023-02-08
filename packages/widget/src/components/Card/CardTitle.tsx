import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardTitle = styled(Typography, {
  shouldForwardProp: (prop) => !['required'].includes(prop as string),
})<{ required?: boolean }>(({ theme, required }) => ({
  fontSize: '0.875rem',
  lineHeight: '1.286',
  letterSpacing: '0.01071em',
  fontWeight: 700,
  padding: theme.spacing(1.75, 2, 0, 2),
  '&:after': {
    content: required ? '" *"' : 'none',
    color: theme.palette.error.main,
  },
}));
