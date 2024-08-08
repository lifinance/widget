import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Tooltip } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { PropsWithChildren } from 'react';
import { ExternalWalletProvider } from '../../providers';
import {
  useConfig,
  useDrawerToolValues,
  useEditToolsActions,
  useHeaderAndFooterToolValues,
} from '../../store';
import { MockElement } from '../Mock';
import { ToggleDrawerButton } from './ToggleDrawerButton';
import {
  DrawerOpenButton,
  FloatingToolsContainer,
  Main,
  WidgetContainer,
  WidgetContainerRow,
} from './WidgetView.style';

interface WidgetViewContainerProps extends PropsWithChildren {
  toggleDrawer?(): void;
}

export function WidgetViewContainer({
  children,
  toggleDrawer,
}: WidgetViewContainerProps) {
  const { config } = useConfig();
  const { isDrawerOpen, drawerWidth } = useDrawerToolValues();
  const { setDrawerOpen } = useEditToolsActions();
  const { showMockHeader, showMockFooter } = useHeaderAndFooterToolValues();

  const isWalletManagementExternal = !!config?.walletConfig;

  const isFullHeightLayout =
    config?.theme?.container?.height === '100%' &&
    config?.theme?.container?.display === 'flex';

  const showHeader = isFullHeightLayout && showMockHeader;
  const showFooter = isFullHeightLayout && showMockFooter;

  return (
    <Main open={isDrawerOpen} drawerWidth={drawerWidth}>
      <ExternalWalletProvider isExternalProvider={isWalletManagementExternal}>
        <FloatingToolsContainer>
          {!isDrawerOpen ? (
            <Tooltip title="Open tools" arrow>
              <DrawerOpenButton onClick={() => setDrawerOpen(true)}>
                <MenuOpenIcon />
              </DrawerOpenButton>
            </Tooltip>
          ) : null}
          {isWalletManagementExternal ? (
            <ConnectButton chainStatus="none" showBalance={false} />
          ) : null}
          {config?.variant === 'drawer' ? (
            <ToggleDrawerButton onClick={toggleDrawer} />
          ) : null}
        </FloatingToolsContainer>
        <WidgetContainer
          removePaddingTop={
            (config?.theme?.container?.height === '100%' && !showHeader) ||
            (config?.theme?.container?.display === 'flex' && !showHeader)
          }
          alignTop={config?.theme?.container?.display === 'flex'}
        >
          {showHeader ? (
            <MockElement sx={{ position: 'fixed', zIndex: 1, top: 0 }}>
              Mock header
            </MockElement>
          ) : null}
          <WidgetContainerRow
            alignTop={config?.theme?.container?.display === 'flex'}
          >
            {children}
          </WidgetContainerRow>
          {showFooter ? <MockElement>Mock footer</MockElement> : null}
        </WidgetContainer>
      </ExternalWalletProvider>
    </Main>
  );
}
