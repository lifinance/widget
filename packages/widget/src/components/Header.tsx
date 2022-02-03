import { AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

const HeaderToolbar = styled(Toolbar)({
  '@media all': {
    minHeight: 48,
  },
});

export const Header: React.FC = ({ children }) => (
  <HeaderAppBar position="relative" elevation={0}>
    <HeaderToolbar>{children}</HeaderToolbar>
  </HeaderAppBar>
);
