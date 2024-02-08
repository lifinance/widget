import type { FC, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { useDefaultElementId } from '../../hooks/useDefaultElementId.js';
import { ElementId, createElementId } from '../../utils/elements.js';
import { stickyHeaderRoutes } from '../../utils/navigationRoutes.js';
import { Container } from './Header.style.js';
import { NavigationHeader } from './NavigationHeader.js';
import { WalletHeader } from './WalletHeader.js';

export const HeaderContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { pathname } = useLocation();
  const elementId = useDefaultElementId();
  return (
    <Container
      id={createElementId(ElementId.Header, elementId)}
      sticky={stickyHeaderRoutes.some((route) => pathname.includes(route))}
    >
      {children}
    </Container>
  );
};

export const Header: FC = () => {
  return (
    <HeaderContainer>
      <WalletHeader />
      <NavigationHeader />
    </HeaderContainer>
  );
};
