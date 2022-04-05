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

export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  children,
  config: {
    enabledChains,
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    useInternalWalletManagement,
    walletCallbacks,
  },
}) => {
  const value = useMemo((): WidgetContextProps => {
    const config = {
      enabledChains,
      fromToken,
      fromAmount,
      toToken,
      useInternalWalletManagement: useInternalWalletManagement || true,
      walletCallbacks,
    };
    try {
      return {
        ...config,
        fromChain:
          typeof fromChain === 'number'
            ? fromChain
            : typeof fromChain === 'string'
            ? getChainByKey(fromChain as ChainKey).id
            : ChainId.ETH,
        toChain:
          typeof toChain === 'number'
            ? toChain
            : typeof toChain === 'string'
            ? getChainByKey(toChain as ChainKey).id
            : ChainId.ETH,
      };
    } catch (e) {
      return config;
    }
  }, [
    enabledChains,
    fromAmount,
    fromChain,
    fromToken,
    toChain,
    toToken,
    useInternalWalletManagement,
    walletCallbacks,
  ]);
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
