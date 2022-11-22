import { isAddress } from '@ethersproject/address';
import { LifiErrorCode } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Big from 'big.js';
import { useWatch } from 'react-hook-form';
import { useDebouncedWatch, useToken } from '.';
import { SwapFormKey, useLiFi, useWallet, useWidgetConfig } from '../providers';
import { useSettings } from '../stores';

const refetchTime = 60_000;

export const useSwapRoutes = () => {
  const lifi = useLiFi();
  const { variant, sdkConfig } = useWidgetConfig();
  const { account, provider } = useWallet();
  const queryClient = useQueryClient();
  const { slippage, enabledBridges, enabledExchanges, routePriority } =
    useSettings([
      'slippage',
      'routePriority',
      'enabledBridges',
      'enabledExchanges',
    ]);
  const [fromChainId, fromTokenAddress, toChainId, toTokenAddress, toAddress] =
    useWatch({
      name: [
        SwapFormKey.FromChain,
        SwapFormKey.FromToken,
        SwapFormKey.ToChain,
        SwapFormKey.ToToken,
        SwapFormKey.ToAddress,
      ],
    });
  const [fromTokenAmount] = useDebouncedWatch([SwapFormKey.FromAmount], 320);
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress);
  const { token: toToken } = useToken(toChainId, toTokenAddress);
  const isEnabled =
    // Boolean(account.address) &&
    !isNaN(fromChainId) &&
    !isNaN(toChainId) &&
    Boolean(fromToken?.address) &&
    Boolean(toToken?.address) &&
    !isNaN(fromTokenAmount) &&
    Number(fromTokenAmount) > 0 &&
    !Number.isNaN(slippage);
  const queryKey = [
    'routes',
    account.address,
    fromChainId,
    fromToken?.address,
    fromTokenAmount,
    toChainId,
    toToken?.address,
    toAddress,
    slippage,
    enabledBridges,
    enabledExchanges,
    routePriority,
    variant,
    sdkConfig?.defaultRouteOptions?.allowSwitchChain,
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
          fromAddress,
          fromChainId,
          fromTokenAddress,
          fromTokenAmount,
          toChainId,
          toTokenAddress,
          toAddress,
          slippage,
          enabledBridges,
          enabledExchanges,
          routePriority,
          variant,
          allowSwitchChain,
        ],
        signal,
      }) => {
        let toWalletAddress;
        try {
          toWalletAddress =
            (await provider?.resolveName(toAddress)) ??
            (isAddress(toAddress) ? toAddress : fromAddress);
        } catch {
          toWalletAddress = isAddress(toAddress) ? toAddress : fromAddress;
        }
        const fromAmount = Big(fromTokenAmount)
          .mul(10 ** (fromToken?.decimals ?? 0))
          .toString();
        const formattedSlippage = parseFloat(slippage) / 100;
        return lifi.getRoutes(
          {
            fromChainId,
            fromAmount,
            fromTokenAddress,
            toChainId,
            toTokenAddress,
            fromAddress,
            toAddress: toWalletAddress,
            options: {
              slippage: formattedSlippage,
              bridges: {
                allow: enabledBridges,
              },
              exchanges: {
                allow: enabledExchanges,
              },
              order: routePriority,
              allowSwitchChain: variant === 'refuel' ? false : allowSwitchChain,
            },
          },
          { signal },
        );
      },
      {
        enabled: isEnabled,
        refetchInterval,
        staleTime: refetchTime,
        cacheTime: refetchTime,
        retry(failureCount, error: any) {
          if (error?.code === LifiErrorCode.NotFound) {
            return false;
          }
          return true;
        },
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
