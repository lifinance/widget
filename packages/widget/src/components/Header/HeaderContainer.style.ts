import { AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.common.black,
  zIndex: 1250,
}));

export const HeaderToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'pt',
})<{ pt?: number }>(({ theme, pt }) => ({
  padding: theme.spacing(pt ?? 0, 3, 0, 3),
  '@media all': {
    minHeight: 48,
  },
}));
