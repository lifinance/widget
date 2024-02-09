import {
  IconButton as MuiIconButton,
  darken,
  lighten,
  styled,
} from '@mui/material';

export const IconButton = styled(MuiIconButton)(({ theme }) => ({
  height: 32,
  width: 32,
  fontSize: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid`,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  zIndex: 1100,
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken(theme.palette.background.paper, 0.02)
        : lighten(theme.palette.background.paper, 0.02),
  },
}));
