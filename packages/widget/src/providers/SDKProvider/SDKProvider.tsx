import type { SDKOptions } from '@lifi/sdk';
import { EVM, Solana, createConfig } from '@lifi/sdk';
import { getWalletClient, switchChain } from '@wagmi/core';
import { createContext, useContext, useMemo } from 'react';
import { version } from '../../config/version';
import { wagmiConfig } from '../WalletProvider';
import { useWidgetConfig } from '../WidgetProvider';

let config: ReturnType<typeof createConfig>;

const SDKContext = createContext<ReturnType<typeof createConfig>>(null!);

export const useLiFi = (): ReturnType<typeof createConfig> =>
  useContext(SDKContext);

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
        ...sdkConfig?.defaultRouteOptions,
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
          getWalletAdapter() {},
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
  }, [apiKey, fee, integrator, referrer, routePriority, sdkConfig, slippage]);

  return children;
};
