import { EVMChain, Route, Token } from '@lifi/sdk';
import Big from 'big.js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useChains, useDebouncedWatch } from '.';
import { SwapFormKey, SwapFormKeyHelper } from '../providers/SwapFormProvider';
import { useWallet } from '../providers/WalletProvider';
import { useTokenBalances } from './useTokenBalances';

interface GasSufficiency {
  gasAmount: Big;
  tokenAmount?: Big;
  insufficientAmount?: Big;
  insufficient?: boolean;
  token: Token;
  chain?: EVMChain;
}

export const useGasSufficiency = (route?: Route) => {
  const { account } = useWallet();
  const [fromChainId, toChainId, fromToken]: [number, number, string] =
    useWatch({
      name: [
        SwapFormKeyHelper.getChainKey('from'),
        SwapFormKeyHelper.getChainKey('to'),
        SwapFormKey.FromToken,
      ],
    });
  const fromAmount = useDebouncedWatch(SwapFormKey.FromAmount, 250);
  const { tokens: fromChainTokenBalances, isBalanceFetched } =
    useTokenBalances(fromChainId);
  const { tokens: toChainTokenBalances } = useTokenBalances(toChainId);
  const { getChainById } = useChains();

  const insufficientGas = useMemo(() => {
    if (!account.isActive || !route || !fromAmount) {
      return [];
    }

    const tokenBalancesByChain = {
      [fromChainId]: fromChainTokenBalances,
      [toChainId]: toChainTokenBalances,
    };

    const gasCosts = route.steps.reduce((groupedGasCosts, step) => {
      if (step.estimate.gasCosts) {
        const { token } = step.estimate.gasCosts[0];
        const gasCostAmount = step.estimate.gasCosts
          .reduce(
            (amount, gasCost) => amount.plus(Big(gasCost.amount || 0)),
            Big(0),
          )
          .div(10 ** token.decimals);
        const groupedGasCost = groupedGasCosts[token.chainId];
        const gasAmount = groupedGasCost
          ? groupedGasCost.gasAmount.plus(gasCostAmount)
          : gasCostAmount;
        groupedGasCosts[token.chainId] = {
          gasAmount,
          tokenAmount: gasAmount,
          token,
          chain: getChainById(token.chainId),
        };
        return groupedGasCosts;
      }
      return groupedGasCosts;
    }, {} as Record<number, GasSufficiency>);

    if (
      gasCosts[fromChainId] &&
      route.fromToken.address === gasCosts[fromChainId].token.address
    ) {
      gasCosts[fromChainId].tokenAmount = gasCosts[fromChainId]?.gasAmount.plus(
        Big(fromAmount),
      );
    }

    [fromChainId, toChainId].forEach((chainId) => {
      if (gasCosts[chainId]) {
        const gasTokenBalance = Big(
          tokenBalancesByChain[chainId]?.find(
            (t) => t.address === gasCosts[chainId].token.address,
          )?.amount ?? 0,
        );

        const insufficientFromChainGas =
          gasTokenBalance.lte(0) ||
          gasTokenBalance.lt(gasCosts[chainId].gasAmount ?? Big(0)) ||
          gasTokenBalance.lt(gasCosts[chainId].tokenAmount ?? Big(0));

        const insufficientFromChainGasAmount = insufficientFromChainGas
          ? gasCosts[chainId].tokenAmount?.minus(gasTokenBalance) ??
            gasCosts[chainId].gasAmount.minus(gasTokenBalance)
          : undefined;

        gasCosts[chainId] = {
          ...gasCosts[chainId],
          insufficient: insufficientFromChainGas,
          insufficientAmount: insufficientFromChainGasAmount,
        };
      }
    });

    const gasCostResult = Object.values(gasCosts).filter(
      (gasCost) => gasCost.insufficient,
    );

    return gasCostResult;
  }, [
    account.isActive,
    fromAmount,
    fromChainId,
    fromChainTokenBalances,
    getChainById,
    route,
    toChainId,
    toChainTokenBalances,
  ]);

  const insufficientFunds = useMemo(() => {
    if (!account.isActive || !fromToken || !fromAmount || !isBalanceFetched) {
      return false;
    }
    const balance = Big(
      fromChainTokenBalances?.find((t) => t.address === fromToken)?.amount ?? 0,
    );
    return Big(fromAmount).gt(balance);
  }, [
    account.isActive,
    fromAmount,
    fromChainTokenBalances,
    fromToken,
    isBalanceFetched,
  ]);

  return {
    insufficientGas,
    insufficientFunds,
  };
};
