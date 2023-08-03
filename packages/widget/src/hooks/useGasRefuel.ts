import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useChains } from '.';
import { FormKey } from '../providers';
import { useGasRecommendation } from './useGasRecommendation';
import { useTokenBalance } from './useTokenBalance';

export const useGasRefuel = () => {
  const { getChainById } = useChains();

  const [fromChainId, fromTokenAddress, toChainId, toAddress] = useWatch({
    name: [
      FormKey.FromChain,
      FormKey.FromToken,
      FormKey.ToChain,
      FormKey.ToAddress,
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
      !gasRecommendation?.available ||
      !nativeToken
    ) {
      return false;
    }
    const tokenBalance = nativeToken.amount ?? 0n;

    // check if the user balance < 50% of the recommended amount
    const recommendedAmount = BigInt(gasRecommendation.recommended.amount) / 2n;

    const insufficientGas = tokenBalance < recommendedAmount;
    return insufficientGas;
  }, [fromChainId, gasRecommendation, nativeToken, toChainId]);

  return {
    enabled: enabled,
    availble: gasRecommendation?.available,
    isLoading: isLoading,
    chain: toChain,
    fromAmount: gasRecommendation?.available
      ? gasRecommendation.fromAmount
      : undefined,
  };
};
