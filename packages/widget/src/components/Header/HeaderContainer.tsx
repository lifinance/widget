import { FC, PropsWithChildren } from 'react';
import { HeaderAppBar, HeaderToolbar } from './Header.style';

export const HeaderContainer: FC<PropsWithChildren<{ height?: number }>> = ({
  children,
  height,
}) => (
  <HeaderAppBar position="relative" elevation={0}>
    <HeaderToolbar height={height}>{children}</HeaderToolbar>
  </HeaderAppBar>
);
