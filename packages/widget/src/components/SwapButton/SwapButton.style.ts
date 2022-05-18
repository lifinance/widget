import { LoadingButton } from '@mui/lab';
import { loadingButtonClasses } from '@mui/lab/LoadingButton';
import { buttonClasses } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const Button = styled(LoadingButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.25, 2),
  fontSize: '1rem',
  [`&.${buttonClasses.disabled}`]: {
    color: 'rgb(0 0 0 / 70%)',
  },
  [`&.${loadingButtonClasses.loading}`]: {
    color: 'transparent',
  },
  [`.${loadingButtonClasses.loadingIndicator}`]: {
    color: 'rgb(0 0 0 / 70%)',
  },
}));
