import { Button } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const CardButton = styled(Button)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white;
  return {
    color: theme.palette.text.primary,
    fontSize: 14,
    padding: theme.spacing(0.75),
    backgroundColor: alpha(backgroundColor, 0.04),
    '&:hover': {
      backgroundColor: alpha(backgroundColor, 0.08),
    },
  };
});
