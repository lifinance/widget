import type { EVMChain, Route, Token } from '@lifi/sdk';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useChains } from '.';
import { useWallet } from '../providers';
import { useTokenBalance } from './useTokenBalance';

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
  const { getChainById } = useChains();
  const { token: fromToken, getTokenBalancesWithRetry } = useTokenBalance(
    route?.fromToken,
  );
  const [insufficientGas, setInsufficientGas] = useState<GasSufficiency[]>();

  const checkInsufficientGas = useCallback(async () => {
    if (!account.address || !route) {
      setInsufficientGas(undefined);
      return;
    }
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
      route.fromToken.address === gasCosts[route.fromChainId]?.token.address
    ) {
      gasCosts[route.fromChainId].tokenAmount = gasCosts[
        route.fromChainId
      ]?.gasAmount.plus(
        Big(route.fromAmount).div(10 ** route.fromToken.decimals),
      );
    }

    const tokenBalances = await getTokenBalancesWithRetry(
      account.address,
      Object.values(gasCosts).map((item) => item.token),
    );

    if (!tokenBalances?.length) {
      setInsufficientGas(undefined);
      return;
    }

    [route.fromChainId, route.toChainId].forEach((chainId) => {
      if (gasCosts[chainId]) {
        const gasTokenBalance = Big(
          tokenBalances?.find(
            (t) =>
              t.chainId === gasCosts[chainId].token.chainId &&
              t.address === gasCosts[chainId].token.address,
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
          insufficientAmount: insufficientFromChainGasAmount?.round(
            5,
            Big.roundUp,
          ),
        };
      }
    });

    const gasCostResult = Object.values(gasCosts).filter(
      (gasCost) => gasCost.insufficient,
    );

    setInsufficientGas(gasCostResult);
  }, [account.address, getChainById, getTokenBalancesWithRetry, route]);

  const insufficientFunds = useMemo(() => {
    if (!account.isActive || !fromToken || !route) {
      return false;
    }
    const balance = Big(fromToken?.amount ?? 0);
    return Big(route.fromAmount)
      .div(10 ** route.fromToken.decimals)
      .gt(balance);
  }, [account.isActive, fromToken, route]);

  useEffect(() => {
    checkInsufficientGas();
  }, [checkInsufficientGas]);

  return {
    insufficientGas,
    insufficientFunds,
  };
};
