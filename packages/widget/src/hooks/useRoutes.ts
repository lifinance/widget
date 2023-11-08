import type { Route, RoutesResponse, Token } from '@lifi/sdk';
import { LiFiErrorCode, getContractCallQuote, getRoutes } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { parseUnits } from 'viem';
import { useConfig } from 'wagmi';
import { useDebouncedWatch, useGasRefuel, useToken } from '.';
import { FormKey, useWidgetConfig } from '../providers';
import { useSettings } from '../stores';
import { useAccount } from './useAccount';
import { useSwapOnly } from './useSwapOnly';

const refetchTime = 60_000;

interface RoutesProps {
  insurableRoute?: Route;
}

export const useRoutes = ({ insurableRoute }: RoutesProps = {}) => {
  const { subvariant, sdkConfig, insurance, contractTool } = useWidgetConfig();
  const { account } = useAccount();
  const config = useConfig();
  const queryClient = useQueryClient();
  const swapOnly = useSwapOnly();
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
  const [fromTokenAmount] = useDebouncedWatch([FormKey.FromAmount], 320);
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
      FormKey.FromChain,
      FormKey.FromToken,
      FormKey.ToAddress,
      FormKey.ToAmount,
      FormKey.ToChain,
      FormKey.ToContractAddress,
      FormKey.ToContractCallData,
      FormKey.ToContractGasLimit,
      FormKey.ToToken,
    ],
  });
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress);
  const { token: toToken } = useToken(toChainId, toTokenAddress);
  const { enabled: enabledRefuel, fromAmount: gasRecommendationFromAmount } =
    useGasRefuel();

  const hasAmount =
    (!isNaN(fromTokenAmount) && Number(fromTokenAmount) > 0) ||
    (!isNaN(toTokenAmount) && Number(toTokenAmount) > 0);

  const contractCallQuoteEnabled: boolean =
    subvariant === 'nft'
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
    swapOnly ? [] : enabledBridges,
    enabledExchanges,
    routePriority,
    subvariant,
    sdkConfig?.routeOptions?.allowSwitchChain,
    enabledRefuel && enabledAutoRefuel,
    gasRecommendationFromAmount,
    insurance,
    insurableRoute?.id,
  ];

  const { data, isLoading, isFetching, isFetched, dataUpdatedAt, refetch } =
    useQuery({
      queryKey,
      queryFn: async ({
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
          subvariant,
          allowSwitchChain,
          enabledRefuel,
          gasRecommendationFromAmount,
          insurance,
          insurableRouteId,
        ],
        signal,
      }) => {
        let toWalletAddress = toAddress || fromAddress;
        // try {
        //   // FIXME: resolve address in one place
        //   toWalletAddress = !isAddress(toAddress)
        //     ? await getEnsAddress(config, {
        //         name: normalize(toAddress),
        //       })
        //     : isAddress(toAddress)
        //     ? toAddress
        //     : fromAddress;
        // } catch {
        //   toWalletAddress = isAddress(toAddress) ? toAddress : fromAddress;
        // }
        const fromAmount = parseUnits(
          fromTokenAmount || 0,
          fromToken!.decimals,
        ).toString();
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

        if (subvariant === 'nft') {
          const contractCallQuote = await getContractCallQuote(
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
              toFallbackAddress: toWalletAddress,
              slippage: formattedSlippage,
            },
            { signal },
          );

          contractCallQuote.action.toToken = toToken!;

          const customStep =
            subvariant === 'nft'
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
            toAddress: toWalletAddress,
            gasCostUSD: contractCallQuote.estimate.gasCosts?.[0].amountUSD,
            steps: [contractCallQuote],
            insurance: { state: 'NOT_INSURABLE', feeAmountUsd: '0' },
          };

          return { routes: [route] } as RoutesResponse;
        }

        const data = await getRoutes(
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
              allowSwitchChain:
                subvariant === 'refuel' ? false : allowSwitchChain,
              insurance: insurance ? Boolean(insurableRoute) : undefined,
            },
          },
          { signal },
        );
        if (data.routes[0]) {
          // Update local tokens cache to keep priceUSD in sync
          const { fromToken, toToken } = data.routes[0];
          [fromToken, toToken].forEach((token) => {
            queryClient.setQueriesData<Token[]>(
              { queryKey: ['token-balances', account.address, token.chainId] },
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
        return data;
      },
      enabled: isEnabled,
      staleTime: refetchTime,
      refetchInterval(query) {
        return Math.min(
          Math.abs(refetchTime - (Date.now() - query.state.dataUpdatedAt)),
          refetchTime,
        );
      },
      retry(_, error: any) {
        if (error?.code === LiFiErrorCode.NotFound) {
          return false;
        }
        return true;
      },
    });

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
