import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Button = styled(MuiButton)(({ theme }) => ({
  padding: theme.spacing(0.5, 1, 0.625, 1),
  lineHeight: 1.0715,
  fontSize: '0.875rem',
  minWidth: 'unset',
}));
