import type { ConfigUpdate } from '@lifi/sdk';
import { LiFi } from '@lifi/sdk';
import { createContext, useContext, useMemo } from 'react';
import { version } from '../../config/version';
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
    const config: ConfigUpdate = {
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
