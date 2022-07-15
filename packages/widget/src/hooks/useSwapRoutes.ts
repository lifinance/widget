import Big from 'big.js';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { useDebouncedWatch, useToken } from '.';
import { LiFi } from '../config/lifi';
import { SwapFormKey } from '../providers/SwapFormProvider';
import { useWallet } from '../providers/WalletProvider';
import { useCurrentRoute, useSettings } from '../stores';

const refetchTime = 60_000;

export const useSwapRoutes = () => {
  const { account } = useWallet();
  const queryClient = useQueryClient();
  const [currentRoute, setCurrentRoute] = useCurrentRoute();
  const { slippage, enabledBridges, enabledExchanges, routePriority } =
    useSettings([
      'slippage',
      'routePriority',
      'enabledBridges',
      'enabledExchanges',
    ]);
  const [fromChainId, fromTokenAddress, toChainId, toTokenAddress] = useWatch({
    name: [
      SwapFormKey.FromChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToChain,
      SwapFormKey.ToToken,
    ],
  });
  const [fromTokenAmount] = useDebouncedWatch([SwapFormKey.FromAmount], 250);
  const { token } = useToken(fromChainId, fromTokenAddress);
  const isEnabled =
    Boolean(account.address) &&
    !isNaN(fromChainId) &&
    !isNaN(toChainId) &&
    Boolean(fromTokenAddress) &&
    Boolean(toTokenAddress) &&
    Boolean(fromTokenAmount) &&
    !isNaN(fromTokenAmount) &&
    !Number.isNaN(slippage);
  const queryKey = [
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
    routePriority,
  ];
  const previousDataUpdatedAt =
    queryClient.getQueryState(queryKey)?.dataUpdatedAt;
  const refetchInterval = previousDataUpdatedAt
    ? Math.min(
        Math.abs(refetchTime - (Date.now() - previousDataUpdatedAt)),
        refetchTime,
      )
    : refetchTime;
  const { data, isLoading, isFetching, isFetched, dataUpdatedAt, refetch } =
    useQuery(
      queryKey,
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
          routePriority,
        ],
        signal,
      }) => {
        return LiFi.getRoutes(
          {
            fromChainId,
            fromAmount: Big(
              Number(fromTokenAmount) * 10 ** (token?.decimals ?? 0),
            ).toString(),
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
              order: routePriority,
            },
          },
          { signal },
        );
      },
      {
        enabled: isEnabled,
        refetchIntervalInBackground: true,
        refetchInterval,
        staleTime: refetchTime,
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
    if (!isCurrentRouteInSet && currentRoute !== recommendedRoute) {
      setCurrentRoute(recommendedRoute);
    }
  }, [currentRoute, data?.routes, setCurrentRoute]);

  return {
    routes: data?.routes,
    isLoading: isEnabled && isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  };
};
