import { LiFiWidget } from '@lifi/widget';
import { useEffect, useState } from 'react';
import { useConfig } from '../store';
import { ExternalWalletProvider } from '../providers';
import { ConnectingWalletButton } from './ConnectingWalletButton';

export function Widget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { config } = useConfig();

  const isWalletManagementExternal = !!config?.walletConfig;

  return mounted && config ? (
    <ExternalWalletProvider isExternalProvider={isWalletManagementExternal}>
      {isWalletManagementExternal ? (
        <ConnectingWalletButton sx={{ marginLeft: 2, marginTop: 1 }} />
      ) : null}
      <LiFiWidget config={config} integrator="li.fi-playground" open />
    </ExternalWalletProvider>
  ) : null;
}
