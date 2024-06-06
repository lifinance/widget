import {
  createDefaultWagmiConfig,
  useSyncWagmiConfig,
} from '@lifi/wallet-management';
import { useAvailableChains } from '@lifi/widget';
import { type FC, type PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

const { config, connectors } = createDefaultWagmiConfig({
  walletConnect: {
    projectId: import.meta.env.VITE_WALLET_CONNECT,
  },
  coinbase: { appName: 'LI.FI NFT Demo' },
});

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains();

  useSyncWagmiConfig(config, connectors, chains);

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};
