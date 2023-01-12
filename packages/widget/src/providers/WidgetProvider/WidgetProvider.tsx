import type { ChainKey } from '@lifi/sdk';
import { getChainByKey } from '@lifi/sdk';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { setDefaultSettings, useSettingsStoreContext } from '../../stores';
import { formatAmount } from '../../utils';
import type { WidgetContextProps, WidgetProviderProps } from './types';

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
    fromAmount,
    ...config
  } = {},
}) => {
  const settingsStoreContext = useSettingsStoreContext();
  const value = useMemo((): WidgetContextProps => {
    try {
      const searchParams = Object.fromEntries(
        new URLSearchParams(window?.location.search),
      );
      // Prevent using fromToken/toToken params if chain is not selected
      ['from', 'to'].forEach((key) => {
        if (searchParams[`${key}Token`] && !searchParams[`${key}Chain`]) {
          delete searchParams[`${key}Token`];
        }
      });
      return {
        ...config,
        fromChain:
          (searchParams.fromChain &&
            isNaN(parseInt(searchParams.fromChain, 10))) ||
          typeof fromChain === 'string'
            ? getChainByKey(
                (
                  searchParams.fromChain || (fromChain as string)
                )?.toLowerCase() as ChainKey,
              )?.id
            : (searchParams.fromChain &&
                !isNaN(parseInt(searchParams.fromChain, 10))) ||
              typeof fromChain === 'number'
            ? parseInt(searchParams.fromChain, 10) || fromChain
            : undefined,
        toChain:
          (searchParams.toChain && isNaN(parseInt(searchParams.toChain, 10))) ||
          typeof toChain === 'string'
            ? getChainByKey(
                (
                  searchParams.toChain || (toChain as string)
                )?.toLowerCase() as ChainKey,
              )?.id
            : (searchParams.toChain &&
                !isNaN(parseInt(searchParams.toChain, 10))) ||
              typeof toChain === 'number'
            ? parseInt(searchParams.toChain, 10) || toChain
            : undefined,
        fromToken:
          searchParams.fromToken?.toLowerCase() || fromToken?.toLowerCase(),
        toToken: searchParams.toToken?.toLowerCase() || toToken?.toLowerCase(),
        fromAmount:
          typeof searchParams.fromAmount === 'string' &&
          !isNaN(parseFloat(searchParams.fromAmount))
            ? formatAmount(searchParams.fromAmount)
            : fromAmount,
      } as WidgetContextProps;
    } catch (e) {
      console.warn(e);
      return config;
    }
  }, [config, fromAmount, fromChain, fromToken, toChain, toToken]);

  useEffect(() => {
    setDefaultSettings(settingsStoreContext, value);
  }, [settingsStoreContext, value]);

  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
