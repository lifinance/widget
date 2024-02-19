import { useMemo, type FC, type PropsWithChildren } from 'react';
import { formatChain, useAvailableChains } from '@lifi/widget';
import type { Chain } from 'viem';
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import { useEnvVariables } from '../../providers/EnvVariablesProvider';
import '@rainbow-me/rainbowkit/styles.css';

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const { EVMWalletConnectId } = useEnvVariables();
  const { chains } = useAvailableChains();

  const wagmiConfig = useMemo(() => {
    const _chains: [Chain, ...Chain[]] = chains?.length
      ? (chains.map(formatChain) as [Chain, ...Chain[]])
      : [mainnet];

    const wagmiConfig = getDefaultConfig({
      appName: 'LI.FI Widget Playground',
      chains: _chains,
      projectId: EVMWalletConnectId,
      ssr: !chains?.length,
    });

    return wagmiConfig;
  }, [chains]);

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={Boolean(chains?.length)}
    >
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
};
