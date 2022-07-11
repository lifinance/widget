import { LoadingButton } from '@mui/lab';
import { loadingButtonClasses } from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils/colors';

export const Button = styled(LoadingButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.shape.borderRadiusSecondary,
  padding: theme.spacing(1.25, 2),
  fontSize: '1rem',
  [`&.${loadingButtonClasses.loading}`]: {
    color: 'transparent',
  },
  [`.${loadingButtonClasses.loadingIndicator}`]: {
    color: getContrastAlphaColor(theme, '70%'),
  },
}));
