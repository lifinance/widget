import LiFi from '@lifinance/sdk';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useQuery } from 'react-query';
import { SwapFormKey, SwapFormKeyHelper } from '../providers/SwapFormProvider';
import { useWalletInterface } from '../services/walletInterface';
import { formatTokenAmount } from '../utils/format';
import { useDebouncedWatch } from './useDebouncedWatch';
import { useToken } from './useToken';

export const useSwapRoutes = () => {
  const { account } = useWalletInterface();
  const { setValue } = useFormContext();
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
      staleTime: 5_000,
      // TODO: probably should be removed
      cacheTime: 5_000,
    },
  );

  useEffect(() => {
    const route = data?.routes[0];
    if (route) {
      setValue(
        SwapFormKeyHelper.getAmountKey('to'),
        formatTokenAmount(
          (Number(route.toAmount) / 10 ** route.toToken.decimals).toString(),
        ),
      );
    } else {
      setValue(SwapFormKeyHelper.getAmountKey('to'), '');
    }
  }, [data?.routes, setValue]);

  return {
    routes: data?.routes,
    isFetching,
    isFetched,
  };
};
