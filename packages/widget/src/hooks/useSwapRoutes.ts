import { isAddress } from '@ethersproject/address';
import type { Route } from '@lifi/sdk';
import { LifiErrorCode } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Big from 'big.js';
import { useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
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
  const [fromTokenAmount] = useDebouncedWatch([SwapFormKey.FromAmount], 320);
  const [
    fromChainId,
    fromTokenAddress,
    toAddress,
    toTokenAmount,
    toChainId,
    toContractAddress,
    toContractCallData,
    toContractGasLimit,
    toTokenAddress,
  ] = useWatch({
    name: [
      SwapFormKey.FromChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToAddress,
      SwapFormKey.ToAmount,
      SwapFormKey.ToChain,
      SwapFormKey.ToContractAddress,
      SwapFormKey.ToContractCallData,
      SwapFormKey.ToContractGasLimit,
      SwapFormKey.ToToken,
    ],
  });
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress);
  const { token: toToken } = useToken(toChainId, toTokenAddress);

  const hasAmount =
    (!isNaN(fromTokenAmount) && Number(fromTokenAmount) > 0) ||
    (!isNaN(toTokenAmount) && Number(toTokenAmount) > 0);

  const contractCallQuoteEnabled: boolean =
    variant === 'nft'
      ? Boolean(toContractAddress && toContractCallData && toContractGasLimit)
      : true;

  const isEnabled =
    !isNaN(fromChainId) &&
    !isNaN(toChainId) &&
    Boolean(fromToken?.address) &&
    Boolean(toToken?.address) &&
    !Number.isNaN(slippage) &&
    hasAmount &&
    contractCallQuoteEnabled;

  const queryKey = [
    'routes',
    account.address,
    fromChainId,
    fromToken?.address,
    fromTokenAmount,
    toAddress,
    toChainId,
    toToken?.address,
    toTokenAmount,
    toContractAddress,
    toContractCallData,
    toContractGasLimit,
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
          toAddress,
          toChainId,
          toTokenAddress,
          toTokenAmount,
          toContractAddress,
          toContractCallData,
          toContractGasLimit,
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
        const fromAmount = Big(fromTokenAmount || 0)
          .mul(10 ** (fromToken?.decimals ?? 0))
          .toFixed(0);
        const formattedSlippage = parseFloat(slippage) / 100;

        if (variant === 'nft') {
          const contractCallQuote = await lifi.getContractCallQuote(
            {
              fromAddress,
              fromChain: fromChainId,
              fromToken: fromTokenAddress,
              toAmount: toTokenAmount,
              toChain: toChainId,
              toToken: toTokenAddress,
              toContractAddress,
              toContractCallData,
              toContractGasLimit,
              // toFallbackAddress: toAddress,
              slippage: formattedSlippage,
            },
            { signal },
          );

          contractCallQuote.estimate.toAmount = toTokenAmount;
          contractCallQuote.estimate.toAmountMin = toTokenAmount;
          contractCallQuote.action.toToken = toToken!;

          const route: Route = {
            id: uuidv4(),
            fromChainId: contractCallQuote.action.fromChainId,
            fromAmountUSD: contractCallQuote.estimate.fromAmountUSD || '',
            fromAmount: contractCallQuote.action.fromAmount,
            fromToken: contractCallQuote.action.fromToken,
            fromAddress: contractCallQuote.action.fromAddress,
            toChainId: contractCallQuote.action.toChainId,
            toAmountUSD: contractCallQuote.estimate.toAmountUSD || '',
            toAmount: toTokenAmount,
            toAmountMin: toTokenAmount,
            toToken: toToken!,
            toAddress: toAddress,
            gasCostUSD: contractCallQuote.estimate.gasCosts?.[0].amountUSD,
            steps: [contractCallQuote],
          };

          return { routes: [route] };
        }
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
