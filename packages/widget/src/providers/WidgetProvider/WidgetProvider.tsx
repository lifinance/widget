import type { ChainKey } from '@lifi/sdk';
import { getChainByKey } from '@lifi/sdk';
import { createContext, useContext, useId, useMemo } from 'react';
import { setDefaultSettings } from '../../stores';
import { formatAmount } from '../../utils';
import type { WidgetContextProps, WidgetProviderProps } from './types';

const initialContext: WidgetContextProps = {
  elementId: '',
  integrator: '',
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
    integrator,
    ...config
  } = {},
}) => {
  const elementId = useId();

  if (!integrator) {
    throw Error('Required property "integrator" is missing.');
  }

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
      const value = {
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
        elementId,
        integrator,
      } as WidgetContextProps;
      setDefaultSettings(value);
      return value;
    } catch (e) {
      console.warn(e);
      return { ...config, elementId, integrator };
    }
  }, [
    config,
    elementId,
    fromAmount,
    fromChain,
    fromToken,
    integrator,
    toChain,
    toToken,
  ]);

  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};
