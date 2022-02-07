import { AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

const HeaderToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'height',
})<{ height?: number }>(({ height }) => ({
  '@media all': {
    minHeight: height ?? 52,
  },
}));

export const Header: React.FC<{ height?: number }> = ({ children, height }) => (
  <HeaderAppBar position="relative" elevation={0}>
    <HeaderToolbar height={height}>{children}</HeaderToolbar>
  </HeaderAppBar>
);
