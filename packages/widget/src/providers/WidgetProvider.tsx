import { Chain, ChainKey, getChainById, getChainByKey } from '@lifinance/sdk';
import { createContext, useContext, useMemo } from 'react';
import { WidgetConfig } from '../types';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <WidgetProvider>.');
};

interface WidgetContext {
  supportedChains: Chain[];
  fromChain?: ChainKey;
  fromToken?: string;
  fromAmount?: number;
  toChain?: ChainKey;
  toToken?: string;
}

interface WidgetProviderProps {
  config: WidgetConfig;
}

const initialContext: WidgetContext = {
  supportedChains: [],
};

const WidgetContext = createContext<WidgetContext>(initialContext);

export const useWidgetConfig = (): WidgetContext => useContext(WidgetContext);

export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  children,
  config: { enabledChains, fromChain, fromToken, fromAmount, toChain, toToken },
}) => {
  const value = useMemo((): WidgetContext => {
    try {
      const chainIds = JSON.parse(enabledChains);
      return {
        supportedChains: chainIds.map(getChainById),
        fromChain:
          typeof fromChain === 'number'
            ? getChainById(fromChain).key
            : typeof fromChain === 'string'
            ? getChainByKey(fromChain as ChainKey).key
            : undefined,
        fromToken,
        fromAmount,
        toChain:
          typeof toChain === 'number'
            ? getChainById(toChain).key
            : typeof toChain === 'string'
            ? getChainByKey(toChain as ChainKey).key
            : undefined,
        toToken,
      };
    } catch (e) {
      return {
        supportedChains: [],
      };
    }
  }, [enabledChains, fromAmount, fromChain, fromToken, toChain, toToken]);
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
