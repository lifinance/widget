import { Button as MuiButton } from '@mui/material';
import { lighten, styled } from '@mui/material/styles';

export const Button = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.shape.borderRadiusSecondary,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.125, 1, 0.375, 1),
  lineHeight: 1,
  fontSize: '0.875rem',
  minWidth: 'unset',
  '&:hover': {
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    borderColor:
      theme.palette.mode === 'light'
        ? lighten(theme.palette.primary.main, 0.5)
        : theme.palette.text.secondary,
  },
}));
