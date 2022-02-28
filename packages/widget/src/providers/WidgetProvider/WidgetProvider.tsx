import { ChainKey, getChainById, getChainByKey } from '@lifinance/sdk';
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
  config: {
    enabledChains,
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    useLiFiWalletManagement,
    walletCallbacks,
  },
}) => {
  const value = useMemo((): WidgetContextProps => {
    try {
      const chainIds = JSON.parse(enabledChains);
      return {
        supportedChains: chainIds.map(getChainById),
        fromChain:
          typeof fromChain === 'number'
            ? getChainById(fromChain).key
            : typeof fromChain === 'string'
            ? getChainByKey(fromChain as ChainKey).key
            : ChainKey.ETH,
        fromToken,
        fromAmount,
        toChain:
          typeof toChain === 'number'
            ? getChainById(toChain).key
            : typeof toChain === 'string'
            ? getChainByKey(toChain as ChainKey).key
            : ChainKey.ETH,
        toToken,
        useLiFiWalletManagement: useLiFiWalletManagement || true,
        walletCallbacks,
      };
    } catch (e) {
      return {
        supportedChains: [],
      };
    }
  }, [
    enabledChains,
    fromAmount,
    fromChain,
    fromToken,
    toChain,
    toToken,
    useLiFiWalletManagement,
    walletCallbacks,
  ]);
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
