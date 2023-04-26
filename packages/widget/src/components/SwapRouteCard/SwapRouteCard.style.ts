import { Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const IconTypography = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.24)
      : alpha(theme.palette.common.white, 0.32),
  lineHeight: 0,
  marginRight: theme.spacing(0.5),
}));
