import LiFi from '@lifinance/sdk';
import { useWatch } from 'react-hook-form';
import { useQuery } from 'react-query';
import { SwapFormKey } from '../providers/SwapFormProvider';
import { useWalletInterface } from '../services/walletInterface';
// import { usePriorityAccount } from './connectorHooks';
import { useToken } from './useToken';

export const useSwapRoutes = () => {
  const { account } = useWalletInterface();
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
    }) => {
      return LiFi.getRoutes({
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
      });
    },
    {
      enabled:
        Boolean(account.address) &&
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
      // TODO: probably should be removed
      cacheTime: 60_000,
    },
  );

  return {
    routes: data?.routes,
    isFetching,
    isFetched,
  };
};
