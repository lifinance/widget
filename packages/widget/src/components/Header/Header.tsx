import type { FC, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { useDefaultElementId } from '../../hooks/useDefaultElementId.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { ElementId, createElementId } from '../../utils/elements.js';
import { stickyHeaderRoutes } from '../../utils/navigationRoutes.js';
import { Container, PositionContainer } from './Header.style.js';
import { NavigationHeader } from './NavigationHeader.js';
import { WalletHeader } from './WalletHeader.js';

export const minHeaderHeight = 64;
export const maxHeaderHeight = 108;

export const HeaderContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { pathname } = useLocation();
  const elementId = useDefaultElementId();
  const { hiddenUI } = useWidgetConfig();

  const headerHeight = hiddenUI?.includes('walletMenu')
    ? minHeaderHeight
    : maxHeaderHeight;

  return (
    <PositionContainer
      id="postion-container"
      sticky={stickyHeaderRoutes.some((route) => pathname.includes(route))}
      maxHeight={headerHeight}
    >
      <Container
        id={createElementId(ElementId.Header, elementId)}
        maxHeight={headerHeight}
      >
        {children}
      </Container>
    </PositionContainer>
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
