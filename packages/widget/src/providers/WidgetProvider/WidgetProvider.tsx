import { ChainId, ChainKey, getChainById, getChainByKey } from '@lifinance/sdk';
import { createContext, useContext, useMemo } from 'react';
import type { WidgetContextProps, WidgetProviderProps } from './types';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <WidgetProvider>.');
};

const initialContext: WidgetContextProps = {
  supportedChains: [],
};

const WidgetContext = createContext<WidgetContextProps>(initialContext);

export const useWidgetConfig = (): WidgetContextProps =>
  useContext(WidgetContext);

export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  children,
  config: { enabledChains, fromChain, fromToken, fromAmount, toChain, toToken },
}) => {
  const value = useMemo((): WidgetContextProps => {
    try {
      const chainIds = JSON.parse(enabledChains);
      return {
        supportedChains: chainIds.map(getChainById),
        fromChain:
          typeof fromChain === 'number'
            ? fromChain
            : typeof fromChain === 'string'
            ? getChainByKey(fromChain as ChainKey).id
            : ChainId.ETH,
        fromToken,
        fromAmount,
        toChain:
          typeof toChain === 'number'
            ? toChain
            : typeof toChain === 'string'
            ? getChainByKey(toChain as ChainKey).id
            : ChainId.ETH,
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
