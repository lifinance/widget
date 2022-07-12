import { isSwapStep } from '@lifi/sdk';
import Big from 'big.js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useDebouncedWatch } from '.';
import { SwapFormKey, SwapFormKeyHelper } from '../providers/SwapFormProvider';
import { useCurrentRoute } from '../stores';
import { useTokenBalances } from './useTokenBalances';

export const useHasSufficientBalance = () => {
  const [route] = useCurrentRoute();
  const [fromChainId, toChainId, fromToken] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey('from'),
      SwapFormKeyHelper.getChainKey('to'),
      SwapFormKey.FromToken,
    ],
  });
  const fromAmount = useDebouncedWatch(SwapFormKey.FromAmount, 250);
  const lastStep = route?.steps.at(-1);
  const { tokens: fromChainTokenBalances } = useTokenBalances(fromChainId);
  const { tokens: toChainTokenBalances } = useTokenBalances(
    lastStep?.action.fromChainId ?? toChainId,
  );

  const hasGasOnStartChain = useMemo(() => {
    const gasToken = route?.steps[0].estimate.gasCosts?.[0].token;
    if (!gasToken) {
      return true;
    }
    const gasTokenBalance = Big(
      fromChainTokenBalances?.find((t) => t.address === gasToken.address)
        ?.amount ?? 0,
    );

    let requiredAmount = route.steps
      .filter((step) => step.action.fromChainId === route.fromChainId)
      .reduce(
        (big, step) => big.plus(Big(step.estimate.gasCosts?.[0].amount || 0)),
        Big(0),
      )
      .div(10 ** gasToken.decimals);
    if (route.fromToken.address === gasToken.address) {
      const tokenBalance = Big(
        fromChainTokenBalances?.find(
          (t) => t.address === route.fromToken.address,
        )?.amount ?? 0,
      );
      requiredAmount = requiredAmount.plus(tokenBalance);
    }
    return gasTokenBalance.gt(0) && gasTokenBalance.gte(requiredAmount);
  }, [fromChainTokenBalances, route]);

  const hasGasOnCrossChain = useMemo(() => {
    const gasToken = lastStep?.estimate.gasCosts?.[0].token;
    if (!gasToken || !isSwapStep(lastStep)) {
      return true;
    }
    const balance = Big(
      toChainTokenBalances?.find((t) => t.address === gasToken.address)
        ?.amount ?? 0,
    );
    const gasEstimate = lastStep.estimate.gasCosts?.[0].amount;
    const requiredAmount = Big(gasEstimate || 0).div(
      10 ** (lastStep.estimate.gasCosts?.[0].token.decimals ?? 0),
    );
    return balance.gt(0) && balance.gte(requiredAmount);
  }, [lastStep, toChainTokenBalances]);

  const hasSufficientBalance = useMemo(() => {
    if (!fromToken || !fromAmount) {
      return true;
    }
    const balance = Big(
      fromChainTokenBalances?.find((t) => t.address === fromToken)?.amount ?? 0,
    );
    return Big(fromAmount).lte(balance);
  }, [fromAmount, fromChainTokenBalances, fromToken]);

  return {
    hasGasOnStartChain,
    hasGasOnCrossChain,
    hasSufficientBalance,
  };
};
