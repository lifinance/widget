import Big from 'big.js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useChains } from '.';
import { SwapFormKey } from '../providers';
import { useGasRecommendation } from './useGasRecommendation';
import { useTokenBalance } from './useTokenBalance';

export const useGasRefuel = () => {
  const { getChainById } = useChains();

  const [fromChainId, fromTokenAddress, toChainId, toTokenAddress, toAddress] =
    useWatch({
      name: [
        SwapFormKey.FromChain,
        SwapFormKey.FromToken,
        SwapFormKey.ToChain,
        SwapFormKey.ToToken,
        SwapFormKey.ToAddress,
      ],
    });

  const toChain = getChainById(toChainId);

  const { token: nativeToken } = useTokenBalance(
    toChainId && toChain?.nativeToken,
    toAddress,
  );

  const { data: gasRecommendation, isLoading } = useGasRecommendation(
    toChainId,
    fromChainId,
    fromTokenAddress,
  );

  const enabled = useMemo(() => {
    if (
      // We don't allow same chain refuel.
      // If a user runs out of gas, he can't send a source chain transaction.
      fromChainId === toChainId ||
      // We don't want to apply auto refuel when swapping to native tokens
      toChain?.nativeToken.address === toTokenAddress ||
      !gasRecommendation?.available ||
      !gasRecommendation.recommended ||
      !nativeToken
    ) {
      return false;
    }
    const tokenBalance = Big(nativeToken.amount ?? 0);

    // check if the user balance < 50% of the recommended amount
    const recommendedAmount = Big(gasRecommendation.recommended.amount)
      .div(10 ** gasRecommendation.recommended.token.decimals)
      .div(2);

    const insufficientGas = tokenBalance.lt(recommendedAmount);
    return insufficientGas;
  }, [
    fromChainId,
    gasRecommendation?.available,
    gasRecommendation?.recommended,
    nativeToken,
    toChain?.nativeToken.address,
    toChainId,
    toTokenAddress,
  ]);

  return {
    enabled: enabled,
    availble: gasRecommendation?.available,
    isLoading: isLoading,
    chain: toChain,
    gasRecommendation,
  };
};
