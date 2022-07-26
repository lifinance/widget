import { LoadingButton } from '@mui/lab';
import { loadingButtonClasses } from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils';

export const Button = styled(LoadingButton)(({ theme }) => ({
  [`&.${loadingButtonClasses.loading}`]: {
    color: 'transparent',
  },
  [`.${loadingButtonClasses.loadingIndicator}`]: {
    color: getContrastAlphaColor(theme, '70%'),
  },
}));
