import { LiFiWidget } from '@lifi/widget';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useConfig } from '../../store';
import { ExternalWalletProvider } from '../../providers';
import { ConnectWalletButton } from './ConnectWalletButton';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {
  DrawerOpenButton,
  FloatingToolsContainer,
  WidgetContainer,
} from './WidgetView.style';
import { Tooltip } from '@mui/material';

interface WidgetViewProps {
  isDrawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export function WidgetView({ isDrawerOpen, setDrawerOpen }: WidgetViewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { config } = useConfig();

  const isWalletManagementExternal = !!config?.walletConfig;

  return mounted && config ? (
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
      <WidgetContainer>
        <LiFiWidget config={config} integrator="li.fi-playground" open />
      </WidgetContainer>
    </ExternalWalletProvider>
  ) : null;
}
