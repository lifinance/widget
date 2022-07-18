import { isSwapStep } from '@lifi/sdk';
import Big from 'big.js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useDebouncedWatch } from '.';
import { SwapFormKey, SwapFormKeyHelper } from '../providers/SwapFormProvider';
import { useWallet } from '../providers/WalletProvider';
import { useCurrentRoute } from '../stores';
import { useTokenBalances } from './useTokenBalances';

export const useHasSufficientBalance = () => {
  const { account } = useWallet();
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
    if (!account.isActive || !gasToken || !fromAmount) {
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
      requiredAmount = requiredAmount.plus(Big(fromAmount));
    }
    return gasTokenBalance.gt(0) && gasTokenBalance.gte(requiredAmount);
  }, [
    account.isActive,
    fromAmount,
    fromChainTokenBalances,
    route?.fromChainId,
    route?.fromToken.address,
    route?.steps,
  ]);

  const hasGasOnCrossChain = useMemo(() => {
    const gasToken = lastStep?.estimate.gasCosts?.[0].token;
    if (!account.isActive || !gasToken || !isSwapStep(lastStep)) {
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
  }, [account.isActive, lastStep, toChainTokenBalances]);

  const hasSufficientBalance = useMemo(() => {
    if (!account.isActive || !fromToken || !fromAmount) {
      return true;
    }
    const balance = Big(
      fromChainTokenBalances?.find((t) => t.address === fromToken)?.amount ?? 0,
    );
    return Big(fromAmount).lte(balance);
  }, [account.isActive, fromAmount, fromChainTokenBalances, fromToken]);

  return {
    hasGasOnStartChain,
    hasGasOnCrossChain,
    hasSufficientBalance,
  };
};
