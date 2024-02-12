import { IconButton as MuiIconButton, alpha, styled } from '@mui/material';

export const CardIconButton = styled(MuiIconButton)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white;
  return {
    padding: theme.spacing(0.5),
    backgroundColor: alpha(backgroundColor, 0.04),
    '&:hover': {
      backgroundColor: alpha(backgroundColor, 0.08),
    },
  };
});
