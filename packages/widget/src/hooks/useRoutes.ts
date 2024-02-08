import type { Route, RoutesResponse, Token } from '@lifi/sdk';
import { LiFiErrorCode, getContractCallQuote, getRoutes } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { parseUnits } from 'viem';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { useFieldValues } from '../stores/form/useFieldValues.js';
import { useSettings } from '../stores/settings/useSettings.js';
import { defaultSlippage } from '../stores/settings/useSettingsStore.js';
import { getChainTypeFromAddress } from '../utils/chainType.js';
import { useAccount } from './useAccount.js';
import { useChain } from './useChain.js';
import { useDebouncedWatch } from './useDebouncedWatch.js';
import { useGasRefuel } from './useGasRefuel.js';
import { useSwapOnly } from './useSwapOnly.js';
import { useToken } from './useToken.js';

const refetchTime = 60_000;

interface RoutesProps {
  insurableRoute?: Route;
}

export const useRoutes = ({ insurableRoute }: RoutesProps = {}) => {
  const { subvariant, sdkConfig, insurance, contractTool } = useWidgetConfig();
  const queryClient = useQueryClient();
  const swapOnly = useSwapOnly();
  const {
    disabledBridges,
    disabledExchanges,
    enabledAutoRefuel,
    routePriority,
    slippage,
  } = useSettings([
    'disabledBridges',
    'disabledExchanges',
    'enabledAutoRefuel',
    'routePriority',
    'slippage',
  ]);
  const [fromTokenAmount] = useDebouncedWatch(320, 'fromAmount');
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
  ] = useFieldValues(
    'fromChain',
    'fromToken',
    'toAddress',
    'toAmount',
    'toChain',
    'toContractAddress',
    'toContractCallData',
    'toContractGasLimit',
    'toToken',
  );
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress);
  const { token: toToken } = useToken(toChainId, toTokenAddress);
  const { chain: fromChain } = useChain(fromChainId);
  const { chain: toChain } = useChain(toChainId);
  const { enabled: enabledRefuel, fromAmount: gasRecommendationFromAmount } =
    useGasRefuel();

  const { account } = useAccount({ chainType: fromChain?.chainType });

  const hasAmount = Number(fromTokenAmount) > 0 || Number(toTokenAmount) > 0;

  const contractCallQuoteEnabled: boolean =
    subvariant === 'nft'
      ? Boolean(
          toContractAddress &&
            toContractCallData &&
            toContractGasLimit &&
            account.address,
        )
      : true;

  // If toAddress is set, it must have the same chainType as toChain
  const hasToAddressAndChainTypeSatisfied =
    toChain &&
    Boolean(toAddress) &&
    getChainTypeFromAddress(toAddress) === toChain.chainType;
  // We need to check for toAddress only if it is set
  const isToAddressSatisfied = toAddress
    ? hasToAddressAndChainTypeSatisfied
    : true;
  // When we bridge between ecosystems we need to be sure toAddress is set and has the same chainType as toChain
  const isChainTypeSatisfied =
    fromChain && toChain && fromChain.chainType !== toChain.chainType
      ? hasToAddressAndChainTypeSatisfied
      : true;

  const isEnabled =
    Boolean(Number(fromChainId)) &&
    Boolean(Number(toChainId)) &&
    Boolean(fromToken?.address) &&
    Boolean(toToken?.address) &&
    !Number.isNaN(slippage) &&
    hasAmount &&
    isToAddressSatisfied &&
    isChainTypeSatisfied &&
    contractCallQuoteEnabled;

  // Some values should be strictly typed and isEnabled ensures that
  const queryKey = [
    'routes',
    account.address,
    fromChainId as number,
    fromToken?.address as string,
    fromTokenAmount,
    toAddress,
    toChainId as number,
    toToken?.address as string,
    toTokenAmount,
    toContractAddress,
    toContractCallData,
    toContractGasLimit,
    slippage,
    swapOnly,
    disabledBridges,
    disabledExchanges,
    routePriority,
    subvariant,
    sdkConfig?.routeOptions?.allowSwitchChain,
    enabledRefuel && enabledAutoRefuel,
    gasRecommendationFromAmount,
    insurance,
    insurableRoute?.id,
  ] as const;

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
          slippage = defaultSlippage,
          swapOnly,
          disabledBridges,
          disabledExchanges,
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
        const toWalletAddress = toAddress || fromAddress;
        const fromAmount = parseUnits(
          fromTokenAmount,
          fromToken!.decimals,
        ).toString();
        const formattedSlippage = parseFloat(slippage) / 100;

        const allowedBridges = swapOnly
          ? []
          : insurableRoute
            ? insurableRoute.steps.flatMap((step) =>
                step.includedSteps.reduce((toolKeys, includedStep) => {
                  if (includedStep.type === 'cross') {
                    toolKeys.push(includedStep.toolDetails.key);
                  }
                  return toolKeys;
                }, [] as string[]),
              )
            : undefined;

        const allowedExchanges = insurableRoute
          ? insurableRoute.steps.flatMap((step) =>
              step.includedSteps.reduce((toolKeys, includedStep) => {
                if (includedStep.type === 'swap') {
                  toolKeys.push(includedStep.toolDetails.key);
                }
                return toolKeys;
              }, [] as string[]),
            )
          : undefined;

        if (subvariant === 'nft') {
          const contractCallQuote = await getContractCallQuote(
            {
              // Contract calls are enabled only when fromAddress is set
              fromAddress: fromAddress as string,
              fromChain: fromChainId,
              fromToken: fromTokenAddress,
              toAmount: toTokenAmount,
              toChain: toChainId,
              toToken: toTokenAddress,
              toContractAddress,
              toContractCallData,
              toContractGasLimit,
              denyBridges: disabledBridges.length ? disabledBridges : undefined,
              denyExchanges: disabledExchanges.length
                ? disabledExchanges
                : undefined,
              allowBridges: allowedBridges,
              allowExchanges: allowedExchanges,
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
            fromAddress,
            fromAmount,
            fromChainId,
            fromTokenAddress,
            toAddress: toWalletAddress,
            toChainId,
            toTokenAddress,
            fromAmountForGas:
              enabledRefuel && gasRecommendationFromAmount
                ? gasRecommendationFromAmount
                : undefined,
            options: {
              allowSwitchChain:
                subvariant === 'refuel' ? false : allowSwitchChain,
              bridges:
                allowedBridges?.length || disabledBridges.length
                  ? {
                      allow: allowedBridges,
                      deny: disabledBridges.length
                        ? disabledBridges
                        : undefined,
                    }
                  : undefined,
              exchanges:
                allowedExchanges?.length || disabledExchanges.length
                  ? {
                      allow: allowedExchanges,
                      deny: disabledExchanges.length
                        ? disabledExchanges
                        : undefined,
                    }
                  : undefined,
              insurance: insurance ? Boolean(insurableRoute) : undefined,
              order: routePriority,
              slippage: formattedSlippage,
            },
          },
          { signal },
        );
        if (data.routes[0] && fromAddress) {
          // Update local tokens cache to keep priceUSD in sync
          const { fromToken, toToken } = data.routes[0];
          [fromToken, toToken].forEach((token) => {
            queryClient.setQueriesData<Token[]>(
              { queryKey: ['token-balances', fromAddress, token.chainId] },
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
