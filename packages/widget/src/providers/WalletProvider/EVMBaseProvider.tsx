import type { DefaultWagmiConfigResult } from '@lifi/wallet-management';
import {
  createDefaultWagmiConfig,
  useSyncWagmiConfig,
} from '@lifi/wallet-management';
import { useRef, type FC, type PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import { defaultWalletConnectProjectId } from '../../config/walletConnect.js';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { LiFiToolLogo } from '../../icons/lifi.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig();
  const { chains } = useAvailableChains();
  const wagmi = useRef<DefaultWagmiConfigResult>();

  if (!wagmi.current) {
    wagmi.current = createDefaultWagmiConfig({
      walletConnect: walletConfig?.walletConnect ?? {
        projectId: defaultWalletConnectProjectId,
      },
      coinbase: walletConfig?.coinbase ?? {
        appName: 'LI.FI',
        appLogoUrl: LiFiToolLogo,
      },
      wagmiConfig: {
        ssr: true,
      },
    });
  }

  useSyncWagmiConfig(wagmi.current.config, wagmi.current.connectors, chains);

  return (
    <WagmiProvider
      config={wagmi.current.config}
      reconnectOnMount={!chains?.length}
    >
      {children}
    </WagmiProvider>
  );
};
