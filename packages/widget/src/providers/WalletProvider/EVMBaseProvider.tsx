import {
  createDefaultWagmiConfig,
  useSyncWagmiConfig,
} from '@lifi/wallet-management';
import { useState, type FC, type PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import { defaultWalletConnectProjectId } from '../../config/walletConnect.js';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { LiFiToolLogo } from '../../icons/lifi.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig();
  const { chains } = useAvailableChains();
  const [wagmi] = useState(() =>
    createDefaultWagmiConfig({
      walletConnect: walletConfig?.walletConnect ?? {
        projectId: defaultWalletConnectProjectId,
      },
      coinbase: walletConfig?.coinbase ?? {
        appName: 'LI.FI',
        appLogoUrl: LiFiToolLogo,
      },
    }),
  );

  useSyncWagmiConfig(wagmi.config, wagmi.connectors, chains);

  return <WagmiProvider config={wagmi.config}>{children}</WagmiProvider>;
};
