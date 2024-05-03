import { formatChain, useAvailableChains } from '@lifi/widget';
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
  lightTheme,
  type Theme as RainbowKitTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useMemo, type FC, type PropsWithChildren } from 'react';
import type { Chain } from 'viem';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useThemeMode } from '../../hooks';
import { useEnvVariables } from '../../providers';
import { theme } from '../PlaygroundThemeProvider/theme';

const rkThemeColors = {
  accentColor: theme.palette.primary.main,
  accentColorForeground: theme.palette.common.white,
};

const rkThemeFonts = {
  body: theme.typography.fontFamily,
};

const rkThemeRadii = {
  actionButton: `${theme.shape.borderRadiusSecondary}px`,
  connectButton: `${theme.shape.borderRadiusSecondary}px`,
  menuButton: `${theme.shape.borderRadiusSecondary}px`,
  modal: `${theme.shape.borderRadius}px`,
  modalMobile: `${theme.shape.borderRadius}px`,
};

const RainbowKitModes = {
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
  }, [chains, EVMWalletConnectId]);

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={Boolean(chains?.length)}
    >
      <RainbowKitProvider theme={RainbowKitModes[themeMode] as RainbowKitTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};
