import { useQuery, useQueryClient } from '@tanstack/react-query';
import Big from 'big.js';
import { useWatch } from 'react-hook-form';
import { useDebouncedWatch, useToken } from '.';
import { LiFi } from '../config/lifi';
import { SwapFormKey } from '../providers/SwapFormProvider';
import { useWallet } from '../providers/WalletProvider';
import { useSettings } from '../stores';

const refetchTime = 60_000;

export const useSwapRoutes = () => {
  const { account } = useWallet();
  const queryClient = useQueryClient();
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
    // Boolean(account.address) &&
    !isNaN(fromChainId) &&
    !isNaN(toChainId) &&
    Boolean(fromTokenAddress) &&
    Boolean(toTokenAddress) &&
    !isNaN(fromTokenAmount) &&
    Number(fromTokenAmount) > 0 &&
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
