import { config, createConfig, type SDKConfig } from '@lifi/sdk';
import { createContext, useContext, useId, useMemo } from 'react';
import { version } from '../../config/version.js';
import { setDefaultSettings } from '../../stores/settings/useSettingsStore.js';
import type { WidgetContextProps, WidgetProviderProps } from './types.js';

const initialContext: WidgetContextProps = {
  elementId: '',
  integrator: '',
};

const WidgetContext = createContext<WidgetContextProps>(initialContext);

export const useWidgetConfig = (): WidgetContextProps =>
  useContext(WidgetContext);

let sdkInitialized = false;

export const WidgetProvider: React.FC<
  React.PropsWithChildren<WidgetProviderProps>
> = ({ children, config: widgetConfig }) => {
  const elementId = useId();

  if (!widgetConfig?.integrator) {
    throw Error('Required property "integrator" is missing.');
  }

  const value = useMemo((): WidgetContextProps => {
    try {
      // Create widget configuration object
      const value = {
        ...widgetConfig,
        elementId,
      } as WidgetContextProps;

      // Set default settings for widget settings store
      setDefaultSettings(value);

      // Configure SDK
      const _config: SDKConfig = {
        ...widgetConfig.sdkConfig,
        apiKey: widgetConfig.apiKey,
        integrator: widgetConfig.integrator ?? window?.location.hostname,
        routeOptions: {
          fee: widgetConfig.feeConfig?.fee || widgetConfig.fee,
          referrer: widgetConfig.referrer,
          order: widgetConfig.routePriority,
          slippage: widgetConfig.slippage,
          ...widgetConfig.sdkConfig?.routeOptions,
        },
        disableVersionCheck: true,
        widgetVersion: version,
        preloadChains: false,
      };
      if (!sdkInitialized) {
        createConfig(_config);
        sdkInitialized = true;
      } else {
        config.set(_config);
      }

      return value;
    } catch (e) {
      console.warn(e);
      return {
        ...widgetConfig,
        elementId,
        integrator: widgetConfig.integrator,
      };
    }
  }, [elementId, widgetConfig]);
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
