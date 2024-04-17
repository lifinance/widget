import { config, createConfig, type SDKConfig } from '@lifi/sdk';
import { createContext, useContext, useId, useMemo } from 'react';
import { version } from '../../config/version.js';
import { setDefaultSettings } from '../../stores/settings/useSettingsStore.js';
import { formatInputAmount } from '../../utils/format.js';
import type { WidgetContextProps, WidgetProviderProps } from './types.js';
import { attemptToFindMatchingToAddressInConfig } from './utils.js';

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
      // Get search params from URL
      const searchParams = Object.fromEntries(
        new URLSearchParams(window?.location.search),
      );
      // Prevent using fromToken/toToken params if chain is not selected
      ['from', 'to'].forEach((key) => {
        if (searchParams[`${key}Token`] && !searchParams[`${key}Chain`]) {
          delete searchParams[`${key}Token`];
        }
      });
      // Create widget configuration object
      const value = {
        ...widgetConfig,
        fromChain:
          (searchParams.fromChain &&
            !isNaN(parseInt(searchParams.fromChain, 10))) ||
          typeof widgetConfig.fromChain === 'number'
            ? parseInt(searchParams.fromChain, 10) || widgetConfig.fromChain
            : undefined,
        toChain:
          (searchParams.toChain &&
            !isNaN(parseInt(searchParams.toChain, 10))) ||
          typeof widgetConfig.toChain === 'number'
            ? parseInt(searchParams.toChain, 10) || widgetConfig.toChain
            : undefined,
        fromToken: searchParams.fromToken || widgetConfig.fromToken,
        toToken: searchParams.toToken || widgetConfig.toToken,
        fromAmount:
          typeof searchParams.fromAmount === 'string' &&
          !isNaN(parseFloat(searchParams.fromAmount))
            ? formatInputAmount(searchParams.fromAmount)
            : widgetConfig.fromAmount,
        toAddress: searchParams.toAddress
          ? attemptToFindMatchingToAddressInConfig(
              searchParams.toAddress,
              widgetConfig,
            )
          : widgetConfig.toAddress,
        integrator: widgetConfig.integrator,
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
          fee: widgetConfig.fee,
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
