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
  const { sdkConfig, fee, integrator, referrer, routePriority, slippage } =
    useWidgetConfig();
  const value = useMemo(() => {
    const config = {
      ...sdkConfig,
      integrator: integrator ?? window.location.hostname,
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
      lifi = new LiFi({
        disableVersionCheck: true,
        widgetVersion: version,
        ...config,
      });
    }
    lifi.setConfig(config);
    return lifi;
  }, [fee, integrator, referrer, routePriority, sdkConfig, slippage]);

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};
