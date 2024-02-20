import { useMemo, type FC, type PropsWithChildren } from 'react';
import { formatChain, useAvailableChains } from '@lifi/widget';
import type { Chain } from 'viem';
import { WagmiProvider } from 'wagmi';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import { useThemeMode } from '../../hooks';
import { useEnvVariables } from '../../providers';
import '@rainbow-me/rainbowkit/styles.css';

const rkThemeColors = {
  accentColor: '#3f49e1',
  accentColorForeground: '#fff',
};

const rkThemeFonts = {
  body: 'Inter, sans-serif',
};

const rkThemeRadii = {
  actionButton: '8px',
  connectButton: '12px',
  menuButton: '8px',
  modal: '12px',
  modalMobile: '12px',
};

const RainbowKitTheme = {
  dark: {
    ...darkTheme(rkThemeColors),
    fonts: rkThemeFonts,
    radii: rkThemeRadii,
  },
  light: {
    ...lightTheme(rkThemeColors),
    fonts: rkThemeFonts,
    radii: rkThemeRadii,
  },
};
export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const { EVMWalletConnectId } = useEnvVariables();
  const { chains } = useAvailableChains();
  const themeMode = useThemeMode();

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
      <RainbowKitProvider theme={RainbowKitTheme[themeMode]}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};
