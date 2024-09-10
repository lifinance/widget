import { Typography, styled } from '@mui/material';

export const CardTitle = styled(Typography, {
  shouldForwardProp: (prop) => !['required'].includes(prop as string),
})<{ required?: boolean }>(({ theme, required }) => ({
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 700,
  padding: theme.spacing(2, 2, 0, 2),
  textAlign: 'left',
  color: theme.palette.text.primary,
  '&:after': {
    content: required ? '" *"' : 'none',
    color: theme.palette.error.main,
  },
}));
