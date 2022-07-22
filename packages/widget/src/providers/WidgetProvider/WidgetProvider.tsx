import { ChainId, ChainKey, getChainByKey } from '@lifi/sdk';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { updateLiFiConfig } from '../../config/lifi';
import type { WidgetContextProps, WidgetProviderProps } from './types';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <WidgetProvider>.');
};

const initialContext: WidgetContextProps = {
  disabledChains: [],
};

const WidgetContext = createContext<WidgetContextProps>(initialContext);

export const useWidgetConfig = (): WidgetContextProps =>
  useContext(WidgetContext);

export const WidgetProvider: React.FC<
  React.PropsWithChildren<WidgetProviderProps>
> = ({
  children,
  config: {
    fromChain,
    fromToken,
    toChain,
    toToken,
    integrator,
    ...config
  } = {},
}) => {
  const value = useMemo((): WidgetContextProps => {
    try {
      return {
        ...config,
        fromChain:
          typeof fromChain === 'number'
            ? fromChain
            : typeof fromChain === 'string'
            ? getChainByKey(fromChain.toLowerCase() as ChainKey).id
            : ChainId.ETH,
        toChain:
          typeof toChain === 'number'
            ? toChain
            : typeof toChain === 'string'
            ? getChainByKey(toChain.toLowerCase() as ChainKey).id
            : ChainId.ETH,
        fromToken: fromToken?.toLowerCase(),
        toToken: toToken?.toLowerCase(),
      };
    } catch (e) {
      console.warn(e);
      return config;
    }
  }, [config, fromChain, fromToken, toChain, toToken]);

  useEffect(() => {
    updateLiFiConfig({
      defaultRouteOptions: {
        integrator: integrator ?? window.location.hostname,
      },
    });
  }, [integrator]);

  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
