import LiFi from '@lifinance/sdk';
import { useWatch } from 'react-hook-form';
import { useQuery } from 'react-query';
import { SwapFormKey } from '../providers/SwapFormProvider';
import { usePriorityAccount } from './connectorHooks';
import { useToken } from './useToken';

export const useSwapRoutes = () => {
  const account = usePriorityAccount();
  const [
    fromChainId,
    fromTokenAddress,
    fromTokenAmount,
    toChainId,
    toTokenAddress,
    slippage,
    enabledBridges,
    enabledExchanges,
  ] = useWatch({
    name: [
      SwapFormKey.FromChain,
      SwapFormKey.FromToken,
      SwapFormKey.FromAmount,
      SwapFormKey.ToChain,
      SwapFormKey.ToToken,
      SwapFormKey.Slippage,
      SwapFormKey.EnabledBridges,
      SwapFormKey.EnabledExchanges,
    ],
  });

  const { token } = useToken(fromChainId, fromTokenAddress);

  const { data, isFetching, isFetched } = useQuery(
    [
      'routes',
      account,
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
        account,
        fromChainId,
        fromTokenAddress,
        fromTokenAmount,
        toChainId,
        toTokenAddress,
        slippage,
        enabledBridges,
        enabledExchanges,
      ],
    }) => {
      return LiFi.getRoutes({
        fromChainId,
        fromAmount: (
          Number(fromTokenAmount) *
          10 ** (token?.decimals ?? 0)
        ).toFixed(0), // new BigNumber(depositAmount).shiftedBy(fromToken.decimals).toFixed(0),
        fromTokenAddress,
        toChainId,
        toTokenAddress,
        fromAddress: account,
        toAddress: account,
        options: {
          slippage: slippage / 100,
          bridges: {
            allow: enabledBridges,
          },
          exchanges: {
            allow: enabledExchanges,
          },
        },
      });
    },
    {
      enabled:
        Boolean(account) &&
        !isNaN(fromChainId) &&
        !isNaN(toChainId) &&
        Boolean(fromTokenAddress) &&
        Boolean(toTokenAddress) &&
        Boolean(fromTokenAmount) &&
        !isNaN(fromTokenAmount) &&
        !isNaN(slippage),
      refetchIntervalInBackground: true,
      refetchInterval: 60_000,
      staleTime: 60_000,
    },
  );

  return {
    routes: data?.routes,
    isFetching,
    isFetched,
  };
};
