import { Chain, getChainById } from '@lifinance/sdk';
import { createContext, useContext, useMemo } from 'react';
import { WidgetConfig } from '../types';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <WidgetProvider>.');
};

interface WidgetContext {
  supportedChains: Chain[];
}

interface WidgetProviderProps {
  config: WidgetConfig;
}

const initialContext: WidgetContext = {
  supportedChains: [],
};

const WidgetContext = createContext<WidgetContext>(initialContext);

export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  children,
  config: { enabledChains },
}) => {
  const value = useMemo((): WidgetContext => {
    try {
      const chainIds = JSON.parse(enabledChains);
      return {
        supportedChains: chainIds.map(getChainById),
      };
    } catch (e) {
      return {
        supportedChains: [],
      };
    }
  }, [enabledChains]);
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};

export const useWidget = (): WidgetContext => useContext(WidgetContext);
