import { ChainId, ChainKey, getChainByKey } from '@lifinance/sdk';
import { createContext, useContext, useMemo } from 'react';
import type { WidgetContextProps, WidgetProviderProps } from './types';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <WidgetProvider>.');
};

const initialContext: WidgetContextProps = {
  enabledChains: [],
};

const WidgetContext = createContext<WidgetContextProps>(initialContext);

export const useWidgetConfig = (): WidgetContextProps =>
  useContext(WidgetContext);

export const WidgetProvider: React.FC<
  React.PropsWithChildren<WidgetProviderProps>
> = ({ children, config: { fromChain, toChain, ...other } }) => {
  const value = useMemo((): WidgetContextProps => {
    const config = {
      ...other,
    };
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
        fromToken: config.fromToken?.toLowerCase(),
        toToken: config.toToken?.toLowerCase(),
      };
    } catch (e) {
      console.warn(e);
      return config;
    }
  }, [fromChain, other, toChain]);
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
