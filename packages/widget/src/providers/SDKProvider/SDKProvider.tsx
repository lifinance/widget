import LIFI from '@lifi/sdk';
import { createContext, useContext, useMemo } from 'react';
import { useWidgetConfig } from '../WidgetProvider';

let lifi: LIFI;

const SDKContext = createContext<LIFI>(null!);

export const useLiFi = (): LIFI => useContext(SDKContext);

export const SDKProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { sdkConfig, integrator } = useWidgetConfig();
  const value = useMemo(() => {
    const config = {
      ...sdkConfig,
      defaultRouteOptions: {
        ...sdkConfig?.defaultRouteOptions,
        integrator: integrator ?? window.location.hostname,
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
  }, [integrator, sdkConfig]);

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};
