import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useDebouncedWatch, useToken } from '.';
import { LiFi } from '../lifi';
import { SwapFormKey } from '../providers/SwapFormProvider';
import { useWallet } from '../providers/WalletProvider';
import { useCurrentRoute } from './useRouteExecution';

const refetchTime = 60_000;

export const useSwapRoutes = () => {
  const { account } = useWallet();
  const [currentRoute, setCurrentRoute] = useCurrentRoute();
  const [
    fromChainId,
    fromTokenAddress,
    toChainId,
    toTokenAddress,
    slippage,
    enabledBridges,
    enabledExchanges,
  ] = useWatch({
    name: [
      SwapFormKey.FromChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToChain,
      SwapFormKey.ToToken,
      SwapFormKey.Slippage,
      SwapFormKey.EnabledBridges,
      SwapFormKey.EnabledExchanges,
    ],
  });
  const [fromTokenAmount] = useDebouncedWatch([SwapFormKey.FromAmount], 500);
  const { token } = useToken(fromChainId, fromTokenAddress);
  const isEnabled =
    Boolean(account.address) &&
    !isNaN(fromChainId) &&
    !isNaN(toChainId) &&
    Boolean(fromTokenAddress) &&
    Boolean(toTokenAddress) &&
    Boolean(fromTokenAmount) &&
    !isNaN(fromTokenAmount) &&
    !isNaN(slippage);

  const { data, isLoading, isFetching, dataUpdatedAt, refetch } = useQuery(
    [
      'routes',
      account.address,
      fromChainId,
      fromTokenAddress,
      fromTokenAmount,
      toChainId,
      toTokenAddress,
      slippage,
      enabledBridges,
      enabledExchanges,
    ],
    async ({
      queryKey: [
        _,
        address,
        fromChainId,
        fromTokenAddress,
        fromTokenAmount,
        toChainId,
        toTokenAddress,
        slippage,
        enabledBridges,
        enabledExchanges,
      ],
      signal,
    }) => {
      return LiFi.getRoutes(
        {
          fromChainId,
          // TODO: simplify
          fromAmount: (
            Number(fromTokenAmount) *
            10 ** (token?.decimals ?? 0)
          ).toFixed(0), // new BigNumber(depositAmount).shiftedBy(fromToken.decimals).toFixed(0),
          fromTokenAddress,
          toChainId,
          toTokenAddress,
          fromAddress: address,
          toAddress: address,
          options: {
            slippage: slippage / 100,
            bridges: {
              allow: enabledBridges,
            },
            exchanges: {
              allow: enabledExchanges,
            },
          },
        },
        { signal },
      );
    },
    {
      enabled: isEnabled,
      refetchIntervalInBackground: true,
      refetchInterval: refetchTime,
      staleTime: refetchTime,
      // TODO: probably should be removed
      cacheTime: refetchTime,
    },
  );

  useEffect(() => {
    // check that the current route is selected from existing routes
    const isCurrentRouteInSet = data?.routes.some(
      (route) => route.id === currentRoute?.id,
    );
    const recommendedRoute = data?.routes[0];
    // we don't want to set the current route again if it's already selected from existing routes
    if (!isCurrentRouteInSet && recommendedRoute) {
      setCurrentRoute(recommendedRoute);
    }
  }, [currentRoute?.id, data?.routes, setCurrentRoute]);

  return {
    routes: data?.routes,
    isLoading: isEnabled && isLoading,
    isFetching,
    dataUpdatedAt,
    refetchTime,
    refetch,
  };
};
