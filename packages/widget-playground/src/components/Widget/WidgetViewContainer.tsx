import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Tooltip } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { PropsWithChildren } from 'react';
import { ExternalWalletProvider } from '../../providers';
import {
  useConfig,
  useEditToolsActions,
  useEditToolsValues,
} from '../../store';
import { ToggleDrawerButton } from './ToggleDrawerButton';
import {
  DrawerOpenButton,
  FloatingToolsContainer,
  Main,
  WidgetContainer,
} from './WidgetView.style';

interface WidgetViewContainerProps extends PropsWithChildren {
  toggleDrawer?(): void;
}

export function WidgetViewContainer({
  children,
  toggleDrawer,
}: WidgetViewContainerProps) {
  const { config } = useConfig();
  const { isDrawerOpen } = useEditToolsValues();
  const { setDrawerOpen } = useEditToolsActions();

  const isWalletManagementExternal = !!config?.walletConfig;

  return (
    <Main open={isDrawerOpen}>
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
        <WidgetContainer>{children}</WidgetContainer>
      </ExternalWalletProvider>
    </Main>
  );
}
