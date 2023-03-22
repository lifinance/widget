import { IconButton as MuiIconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

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
