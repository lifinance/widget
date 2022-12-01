import LIFI from '@lifi/sdk';
import { createContext, useContext, useMemo } from 'react';
import { useWidgetConfig } from '../WidgetProvider';

let lifi: LIFI;

const SDKContext = createContext<LIFI>(null!);

export const useLiFi = (): LIFI => useContext(SDKContext);

export const SDKProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { sdkConfig, fee, integrator, referrer, routePriority, slippage } =
    useWidgetConfig();
  const value = useMemo(() => {
    const config = {
      ...sdkConfig,
      defaultRouteOptions: {
        fee,
        integrator: integrator ?? window.location.hostname,
        referrer,
        routePriority,
        slippage,
        ...sdkConfig?.defaultRouteOptions,
      },
    };
    if (!lifi) {
      lifi = new LIFI({
        disableVersionCheck: true,
        ...config,
      });
    }
    lifi.setConfig(config);
    return lifi;
  }, [fee, integrator, referrer, routePriority, sdkConfig, slippage]);

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};
