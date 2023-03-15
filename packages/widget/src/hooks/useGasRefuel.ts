import Big from 'big.js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useChains } from '.';
import { SwapFormKey } from '../providers';
import { useGasRecommendation } from './useGasRecommendation';
import { useTokenBalance } from './useTokenBalance';

export const useGasRefuel = () => {
  const { getChainById } = useChains();

  const [fromChain, fromToken, toChain, toAddress] = useWatch({
    name: [
      SwapFormKey.FromChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToChain,
      SwapFormKey.ToAddress,
    ],
  });

  const currentChain = getChainById(toChain);

  const { token: nativeToken } = useTokenBalance(
    toChain && currentChain?.nativeToken,
    toAddress,
  );

  const { data: gasRecommendation, isLoading } = useGasRecommendation(
    toChain,
    fromChain,
    fromToken,
  );

  const enabled = useMemo(() => {
    if (
      // We don't allow same chain refuel.
      // If a user runs out of gas, he can't send a source chain transaction.
      fromChain !== toChain &&
      gasRecommendation?.available &&
      gasRecommendation.recommended &&
      nativeToken
    ) {
      const tokenBalance = Big(nativeToken.amount ?? 0);

      // check if the user balance < 50% of the recommended amount
      const recommendedAmount = Big(gasRecommendation.recommended.amount)
        .div(10 ** gasRecommendation.recommended.token.decimals)
        .div(2);

      const insufficientGas = tokenBalance.lt(recommendedAmount);
      return insufficientGas;
    }
    return false;
  }, [
    fromChain,
    gasRecommendation?.available,
    gasRecommendation?.recommended,
    nativeToken,
    toChain,
  ]);

  return {
    enabled: enabled,
    availble: gasRecommendation?.available,
    isLoading: isLoading,
    chain: currentChain,
    gasRecommendation,
  };
};
