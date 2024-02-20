import type { PropsWithChildren } from 'react';
import {
  useConfig,
  useEditToolsActions,
  useEditToolsValues,
} from '../../store';
import { ExternalWalletProvider } from '../../providers';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {
  DrawerOpenButton,
  FloatingToolsContainer,
  Main,
  WidgetContainer,
} from './WidgetView.style';
import { Tooltip } from '@mui/material';

export function WidgetViewContainer({ children }: PropsWithChildren) {
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
          {isWalletManagementExternal ? <ConnectButton /> : null}
        </FloatingToolsContainer>
        <WidgetContainer>{children}</WidgetContainer>
      </ExternalWalletProvider>
    </Main>
  );
}
