import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Tooltip } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { PropsWithChildren } from 'react';
import { ExternalWalletProvider } from '../../providers';
import {
  useConfig,
  useDrawerToolValues,
  useEditToolsActions,
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

const showMockHeader = true;
const showMockFooter = true;

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

  const isWalletManagementExternal = !!config?.walletConfig;

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
          id="widget-container"
          fullHeightView={
            (config?.theme?.container?.height === '100%' && !showMockHeader) ||
            (config?.theme?.container?.display === 'flex' && !showMockHeader)
          }
          alignTop={config?.theme?.container?.display === 'flex'}
        >
          {showMockHeader ? (
            <MockElement sx={{ position: 'fixed', zIndex: 1, top: 0 }}>
              Mock header
            </MockElement>
          ) : null}
          <WidgetContainerRow
            // sx={{ maxHeight: 900 }} // for sticky headers to work there needs to be an ancester with fixed height
            alignTop={config?.theme?.container?.display === 'flex'}
          >
            {children}
          </WidgetContainerRow>
          {showMockFooter ? <MockElement>Mock footer</MockElement> : null}
        </WidgetContainer>
      </ExternalWalletProvider>
    </Main>
  );
}
