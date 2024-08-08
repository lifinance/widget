import type { FC, PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDefaultElementId } from '../../hooks/useDefaultElementId.js';
import { ElementId, createElementId } from '../../utils/elements.js';
import { stickyHeaderRoutes } from '../../utils/navigationRoutes.js';
import { Container, ContainerPlaceholder } from './Header.style.js';
import { NavigationHeader } from './NavigationHeader.js';
import { WalletHeader } from './WalletHeader.js';

export const HeaderContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { pathname } = useLocation();
  const elementId = useDefaultElementId();
  const headerContainerRef = useRef<HTMLDivElement | undefined>(undefined);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerContainerRef.current) {
      setHeaderHeight(headerContainerRef.current.clientHeight);
    }
  }, [headerContainerRef]);

  return (
    <>
      <Container
        ref={headerContainerRef}
        id={createElementId(ElementId.Header, elementId)}
        sticky={stickyHeaderRoutes.some((route) => pathname.includes(route))}
      >
        {children}
      </Container>
      <ContainerPlaceholder height={headerHeight}>&nbsp;</ContainerPlaceholder>
    </>
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
