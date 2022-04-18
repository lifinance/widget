import { FC, PropsWithChildren } from 'react';
import { HeaderAppBar, HeaderToolbar } from './Header.style';

export const HeaderContainer: FC<PropsWithChildren<{ pt?: number }>> = ({
  children,
  pt,
}) => (
  <HeaderAppBar position="relative" elevation={0}>
    <HeaderToolbar pt={pt}>{children}</HeaderToolbar>
  </HeaderAppBar>
);
