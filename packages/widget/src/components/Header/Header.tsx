import type { FC, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { useWidgetConfig } from '../../providers';
import { ElementId, stickyHeaderRoutes } from '../../utils';
import { Container } from './Header.style';
import { NavigationHeader } from './NavigationHeader';
import { WalletHeader } from './WalletHeader';

export const HeaderContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <Container
      id={ElementId.Header}
      sticky={stickyHeaderRoutes.some((route) => pathname.includes(route))}
    >
      {children}
    </Container>
  );
};

export const Header: FC = () => {
  const { walletManagement } = useWidgetConfig();
  return (
    <HeaderContainer>
      {!walletManagement ? <WalletHeader /> : null}
      <NavigationHeader />
    </HeaderContainer>
  );
};
