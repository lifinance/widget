import { AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, PropsWithChildren } from 'react';

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
  zIndex: 1250
}));

const HeaderToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'height',
})<{ height?: number }>(({ height }) => ({
  '@media all': {
    minHeight: height ?? 52,
  },
}));

export const Header: FC<PropsWithChildren<{ height?: number }>> = ({ children, height }) => (
  <HeaderAppBar position="relative" elevation={0}>
    <HeaderToolbar height={height}>{children}</HeaderToolbar>
  </HeaderAppBar>
);
