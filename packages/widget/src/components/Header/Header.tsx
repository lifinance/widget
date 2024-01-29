import type { FC, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { useDefaultElementId } from '../../hooks';
import { ElementId, createElementId, stickyHeaderRoutes } from '../../utils';
import { Container } from './Header.style';
import { NavigationHeader } from './NavigationHeader';
import { WalletHeader } from './WalletHeader';

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
