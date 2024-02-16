import { LiFiWidget } from '@lifi/widget';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  useConfig,
  useEditToolsActions,
  useEditToolsValues,
} from '../../store';
import { ExternalWalletProvider } from '../../providers';
import { ConnectWalletButton } from './ConnectWalletButton';
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
          {isWalletManagementExternal ? <ConnectWalletButton /> : null}
        </FloatingToolsContainer>
        <WidgetContainer>{children}</WidgetContainer>
      </ExternalWalletProvider>
    </Main>
  );
}
