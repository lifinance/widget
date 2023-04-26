import { isAddress } from '@ethersproject/address';
import type { Route, RoutesResponse, Token } from '@lifi/sdk';
import { LifiErrorCode } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Big from 'big.js';
import { useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useDebouncedWatch, useGasRefuel, useToken } from '.';
import { SwapFormKey, useLiFi, useWallet, useWidgetConfig } from '../providers';
import { useSettings } from '../stores';

const refetchTime = 60_000;

interface SwapRoutesProps {
  onSettled?: (data?: RoutesResponse) => void;
  insurableRoute?: Route;
}

export const useSwapRoutes = ({
  onSettled,
  insurableRoute,
}: SwapRoutesProps = {}) => {
  const lifi = useLiFi();
  const { variant, sdkConfig, insurance, contractTool } = useWidgetConfig();
  const { account, provider } = useWallet();
  const queryClient = useQueryClient();
  const {
    slippage,
    enabledBridges,
    enabledAutoRefuel,
    enabledExchanges,
    routePriority,
  } = useSettings([
    'slippage',
    'routePriority',
    'enabledAutoRefuel',
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
  const { enabled: enabledRefuel, gasRecommendation } = useGasRefuel();

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
    enabledRefuel && enabledAutoRefuel,
    gasRecommendation?.fromAmount,
    insurance,
    insurableRoute?.id,
  ];

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
          enabledRefuel,
          gasRecommendationFromAmount,
          insurance,
          insurableRouteId,
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

        const allowedBridges: string[] = insurableRoute
          ? insurableRoute.steps.flatMap((step) =>
              step.includedSteps
                .filter((includedStep) => includedStep.type === 'cross')
                .map((includedStep) => includedStep.toolDetails.key),
            )
          : enabledBridges;

        const allowedExchanges: string[] = insurableRoute
          ? insurableRoute.steps.flatMap((step) =>
              step.includedSteps
                .filter((includedStep) => includedStep.type === 'swap')
                .map((includedStep) => includedStep.toolDetails.key),
            )
          : enabledExchanges;

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
              allowBridges: allowedBridges,
              // toFallbackAddress: toAddress,
              slippage: formattedSlippage,
            },
            { signal },
          );

          contractCallQuote.estimate.toAmount = toTokenAmount;
          contractCallQuote.estimate.toAmountMin = toTokenAmount;
          contractCallQuote.action.toToken = toToken!;

          const customStep =
            variant === 'nft'
              ? contractCallQuote.includedSteps?.find(
                  (step) => step.type === 'custom',
                )
              : undefined;

          if (customStep && contractTool) {
            const toolDetails = {
              key: contractTool.name,
              name: contractTool.name,
              logoURI: contractTool.logoURI,
            };
            customStep.toolDetails = toolDetails;
            contractCallQuote.toolDetails = toolDetails;
          }

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
            insurance: { state: 'NOT_INSURABLE', feeAmountUsd: '0' },
          };

          return { routes: [route] } as RoutesResponse;
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
            fromAmountForGas:
              enabledRefuel && gasRecommendationFromAmount
                ? gasRecommendationFromAmount
                : undefined,
            options: {
              slippage: formattedSlippage,
              bridges: {
                allow: allowedBridges,
              },
              exchanges: {
                allow: allowedExchanges,
              },
              order: routePriority,
              allowSwitchChain: variant === 'refuel' ? false : allowSwitchChain,
              insurance: insurance ? Boolean(insurableRoute) : undefined,
            },
          },
          { signal },
        );
      },
      {
        enabled: isEnabled,
        staleTime: refetchTime,
        cacheTime: refetchTime,
        refetchInterval(data, query) {
          return Math.min(
            Math.abs(refetchTime - (Date.now() - query.state.dataUpdatedAt)),
            refetchTime,
          );
        },
        retry(failureCount, error: any) {
          if (error?.code === LifiErrorCode.NotFound) {
            return false;
          }
          return true;
        },
        onSuccess(data) {
          if (data.routes[0]) {
            // Update local tokens cache to keep priceUSD in sync
            const { fromToken, toToken } = data.routes[0];
            [fromToken, toToken].forEach((token) => {
              queryClient.setQueriesData<Token[]>(
                ['token-balances', account.address, token.chainId],
                (data) => {
                  if (data) {
                    const clonedData = [...data];
                    const index = clonedData.findIndex(
                      (dataToken) => dataToken.address === token.address,
                    );
                    clonedData[index] = {
                      ...clonedData[index],
                      ...token,
                    };
                    return clonedData;
                  }
                },
              );
            });
          }
        },
        onSettled,
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
