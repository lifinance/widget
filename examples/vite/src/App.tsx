/* eslint-disable no-console */
import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { WalletHeader } from './components/WalletHeader';
import { useEthersSigner, walletClientToSigner } from './hooks/useEthersSigner';
import { switchChain } from './utils/switchChain';

export function App() {
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const signer = useEthersSigner();

  const widgetConfig: WidgetConfig = useMemo(() => {
    const config: WidgetConfig = {
      integrator: 'vite-example',
      containerStyle: {
        border: `1px solid rgb(234, 234, 234)`,
        borderRadius: '16px',
      },
      walletManagement: {
        signer: signer,
        connect: async () => {
          const result = await connectAsync({ connector: connectors[0] });
          const walletClient = await result.connector?.getWalletClient();
          if (walletClient) {
            return walletClientToSigner(walletClient);
          } else {
            throw Error('WalletClient not found');
          }
        },
        disconnect: async () => {
          disconnect();
        },
        switchChain,
      },
    };

    return config;
  }, [signer, connectAsync, connectors, disconnect]);

  return (
    <Box>
      <WalletHeader />
      <LiFiWidget integrator="vite-example" config={widgetConfig} />
    </Box>
  );
}
