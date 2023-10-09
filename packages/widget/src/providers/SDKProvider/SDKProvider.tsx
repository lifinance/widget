import type { SDKOptions } from '@lifi/sdk';
import { EVM, LiFi } from '@lifi/sdk';
import { createContext, useContext, useMemo } from 'react';
import type { Address } from 'viem';
import { createWalletClient, custom } from 'viem';
import { version } from '../../config/version';
import { liFiWalletManagement } from '../WalletProvider';
import { useWidgetConfig } from '../WidgetProvider';

let lifi: LiFi;

const SDKContext = createContext<LiFi>(null!);

export const useLiFi = (): LiFi => useContext(SDKContext);

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
  const value = useMemo(() => {
    const config: SDKOptions = {
      ...sdkConfig,
      apiKey,
      integrator: integrator ?? window.location.hostname,
      defaultRouteOptions: {
        integrator: integrator ?? window.location.hostname,
        fee,
        referrer,
        order: routePriority,
        slippage,
        ...sdkConfig?.defaultRouteOptions,
      },
      providers: [
        EVM({
          getWalletClient() {
            const account =
              liFiWalletManagement.connectedWallets.at(0)?.account;
            const client = createWalletClient({
              account: account?.address as Address,
              transport: custom(account?.provider?.provider as any),
            });

            return Promise.resolve(client);
          },
        }),
      ],
    };
    if (!lifi) {
      lifi = new LiFi({
        disableVersionCheck: true,
        widgetVersion: version,
        ...config,
      });
    }
    lifi.setConfig(config);
    return lifi;
  }, [apiKey, fee, integrator, referrer, routePriority, sdkConfig, slippage]);

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};
