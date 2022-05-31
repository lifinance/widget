import { IconButton as MuiIconButton } from '@mui/material';
import { darken, styled } from '@mui/material/styles';

export const IconButton = styled(MuiIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid`,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  zIndex: 1200,
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: darken(theme.palette.background.paper, 0.04),
  },
}));
