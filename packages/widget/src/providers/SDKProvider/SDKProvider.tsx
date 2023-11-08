import type { SDKOptions } from '@lifi/sdk';
import { EVM, Solana, createConfig } from '@lifi/sdk';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletClient, switchChain } from '@wagmi/core';
import { useMemo } from 'react';
import { version } from '../../config/version';
import { wagmiConfig } from '../WalletProvider';
import { useWidgetConfig } from '../WidgetProvider';

let config: ReturnType<typeof createConfig>;

export const SDKProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    sdkConfig,
    integrator,
    apiKey,
    fee,
    referrer,
    routePriority,
    slippage,
  } = useWidgetConfig();

  const { wallet } = useWallet();

  useMemo(() => {
    const _config: SDKOptions = {
      ...sdkConfig,
      apiKey,
      integrator: integrator ?? window.location.hostname,
      routeOptions: {
        integrator: integrator ?? window.location.hostname,
        fee,
        referrer,
        order: routePriority,
        slippage,
        ...sdkConfig?.routeOptions,
      },
      providers: [
        EVM({
          getWalletClient: () => getWalletClient(wagmiConfig),
          switchChain: async (chainId: number) => {
            await switchChain(wagmiConfig, { chainId });
            return getWalletClient(wagmiConfig);
          },
        }),
        Solana({
          async getWalletAdapter() {
            return wallet?.adapter as WalletAdapter;
          },
        }),
      ],
      disableVersionCheck: true,
      widgetVersion: version,
    };
    if (!config) {
      config = createConfig(_config);
    } else {
      config.set(_config);
    }
  }, [
    apiKey,
    fee,
    integrator,
    referrer,
    routePriority,
    sdkConfig,
    slippage,
    wallet?.adapter,
  ]);

  return children;
};
