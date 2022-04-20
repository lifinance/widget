import { isSwapStep, Route } from '@lifinance/sdk';
import Big from 'big.js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { SwapFormKeyHelper } from '../providers/SwapFormProvider';
import { useTokenBalances } from './useTokenBalances';

export const useHasSufficientBalance = (route?: Route) => {
  const [fromChainId, toChainId] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey('from'),
      SwapFormKeyHelper.getChainKey('to'),
    ],
  });
  const lastStep = route?.steps.at(-1);
  const { tokensWithBalance: fromChainTokenBalances } =
    useTokenBalances(fromChainId);
  const { tokensWithBalance: toChainTokenBalances } = useTokenBalances(
    lastStep?.action.fromChainId ?? toChainId,
  );

  const hasGasBalanceOnStartChain = useMemo(() => {
    const token = route?.steps[0].estimate.gasCosts?.[0].token;
    if (!token) {
      return true;
    }
    const balance = Big(
      fromChainTokenBalances?.find((t) => t.address === token.address)
        ?.amount ?? 0,
    );
    const requiredAmount = route.steps
      .filter((step) => step.action.fromChainId === route.fromChainId)
      .reduce(
        (big, step) => big.plus(Big(step.estimate.gasCosts?.[0].amount || 0)),
        Big(0),
      )
      .div(10 ** token.decimals);
    return balance.gt(0) && balance.gte(requiredAmount);
  }, [fromChainTokenBalances, route]);

  const hasGasOnCrossChain = useMemo(() => {
    const token = lastStep?.estimate.gasCosts?.[0].token;
    if (!token || !isSwapStep(lastStep)) {
      return true;
    }
    const balance = Big(
      toChainTokenBalances?.find((t) => t.address === token.address)?.amount ??
        0,
    );
    const gasEstimate = lastStep.estimate.gasCosts?.[0].amount;
    const requiredAmount = Big(gasEstimate || 0).div(
      10 ** (lastStep.estimate.gasCosts?.[0].token.decimals ?? 0),
    );
    return balance.gt(0) && balance.gte(requiredAmount);
  }, [lastStep, toChainTokenBalances]);

  const hasSufficientBalance = useMemo(() => {
    if (!route) {
      return true;
    }
    const balance = Big(
      fromChainTokenBalances?.find((t) => t.address === route.fromToken.address)
        ?.amount ?? 0,
    );
    return Big(route.fromAmount)
      .div(10 ** (route.fromToken.decimals ?? 0))
      .lte(balance);
  }, [fromChainTokenBalances, route]);

  return {
    hasGasBalanceOnStartChain,
    hasGasOnCrossChain,
    hasSufficientBalance,
  };
};
