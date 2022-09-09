import type { EVMChain, Route, Token } from '@lifi/sdk';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useChains, useDebouncedWatch } from '.';
import {
  SwapFormKey,
  SwapFormKeyHelper,
  useLiFi,
  useWallet,
} from '../providers';
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
  const lifi = useLiFi();
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
  const { getChainById } = useChains();
  const { tokensWithBalance: fromChainTokenBalances } =
    useTokenBalances(fromChainId);
  const [insufficientGas, setInsufficientGas] = useState<GasSufficiency[]>();

  const checkInsufficientGas = useCallback(async () => {
    if (!account.isActive || !route || !fromAmount) {
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
      gasCosts[fromChainId] &&
      route.fromToken.address === gasCosts[fromChainId].token.address
    ) {
      gasCosts[fromChainId].tokenAmount = gasCosts[fromChainId]?.gasAmount.plus(
        Big(fromAmount),
      );
    }

    const tokenBalances = await lifi.getTokenBalances(
      account.address as string,
      Object.values(gasCosts).map((item) => item.token),
    );

    if (!tokenBalances?.length) {
      return;
    }

    [fromChainId, toChainId].forEach((chainId) => {
      if (gasCosts[chainId]) {
        const gasTokenBalance = Big(
          tokenBalances?.find(
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

    setInsufficientGas(gasCostResult);
  }, [
    account.address,
    account.isActive,
    fromAmount,
    fromChainId,
    getChainById,
    lifi,
    route,
    toChainId,
  ]);

  const insufficientFunds = useMemo(() => {
    if (
      !account.isActive ||
      !fromToken ||
      !fromAmount ||
      !fromChainTokenBalances
    ) {
      return false;
    }
    const balance = Big(
      fromChainTokenBalances?.find((t) => t.address === fromToken)?.amount ?? 0,
    );
    return Big(fromAmount).gt(balance);
  }, [account.isActive, fromAmount, fromChainTokenBalances, fromToken]);

  useEffect(() => {
    checkInsufficientGas();
  }, [checkInsufficientGas]);

  return {
    insufficientGas,
    insufficientFunds,
  };
};
