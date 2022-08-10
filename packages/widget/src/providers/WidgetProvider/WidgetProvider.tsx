import { ChainId, ChainKey, getChainByKey } from '@lifi/sdk';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { updateLiFiConfig } from '../../config/lifi';
import { useWallet } from '../WalletProvider';
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
    fromAmount,
    integrator,
    ...config
  } = {},
}) => {
  const { account } = useWallet();
  const value = useMemo((): WidgetContextProps => {
    try {
      const searchParams = Object.fromEntries(
        new URLSearchParams(window?.location.search),
      );
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
              ).id
            : (searchParams.fromChain &&
                !isNaN(parseInt(searchParams.fromChain, 10))) ||
              typeof fromChain === 'number'
            ? parseInt(searchParams.fromChain, 10) || fromChain
            : account.chainId ?? ChainId.ETH,
        toChain:
          (searchParams.toChain && isNaN(parseInt(searchParams.toChain, 10))) ||
          typeof toChain === 'string'
            ? getChainByKey(
                (
                  searchParams.toChain || (toChain as string)
                )?.toLowerCase() as ChainKey,
              ).id
            : (searchParams.toChain &&
                !isNaN(parseInt(searchParams.toChain, 10))) ||
              typeof toChain === 'number'
            ? parseInt(searchParams.toChain, 10) || toChain
            : ChainId.ETH,
        fromToken:
          searchParams.fromToken?.toLowerCase() || fromToken?.toLowerCase(),
        toToken: searchParams.toToken?.toLowerCase() || toToken?.toLowerCase(),
        fromAmount:
          typeof searchParams.fromAmount === 'string' &&
          !isNaN(parseFloat(searchParams.fromAmount))
            ? searchParams.fromAmount
            : fromAmount,
      } as WidgetContextProps;
    } catch (e) {
      console.warn(e);
      return config;
    }
  }, [
    account.chainId,
    config,
    fromAmount,
    fromChain,
    fromToken,
    toChain,
    toToken,
  ]);

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
