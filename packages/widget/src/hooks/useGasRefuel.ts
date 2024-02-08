import { useMemo } from 'react';
import { useFieldValues } from '../stores/form/useFieldValues.js';
import { useAvailableChains } from './useAvailableChains.js';
import { useGasRecommendation } from './useGasRecommendation.js';
import { useTokenBalance } from './useTokenBalance.js';

export const useGasRefuel = () => {
  const { getChainById } = useAvailableChains();

  const [fromChainId, fromTokenAddress, toChainId, toAddress] = useFieldValues(
    'fromChain',
    'fromToken',
    'toChain',
    'toAddress',
  );

  const toChain = getChainById(toChainId);
  const fromChain = getChainById(fromChainId);

  const { token: nativeToken } = useTokenBalance(
    toAddress,
    toChainId ? toChain?.nativeToken : undefined,
    toChain,
  );

  const { data: gasRecommendation, isLoading } = useGasRecommendation(
    toChainId,
    fromChainId,
    fromTokenAddress,
  );

  // When we bridge between ecosystems we need to be sure toAddress is set
  const isChainTypeSatisfied =
    fromChain?.chainType !== toChain?.chainType ? Boolean(toAddress) : true;

  const enabled = useMemo(() => {
    if (
      // We don't allow same chain refuel.
      // If a user runs out of gas, he can't send a source chain transaction.
      fromChainId === toChainId ||
      !gasRecommendation?.available ||
      !nativeToken ||
      !isChainTypeSatisfied
    ) {
      return false;
    }
    const tokenBalance = nativeToken.amount ?? 0n;

    // Check if the user balance < 50% of the recommended amount
    const recommendedAmount = BigInt(gasRecommendation.recommended.amount) / 2n;

    const insufficientGas = tokenBalance < recommendedAmount;
    return insufficientGas;
  }, [
    fromChainId,
    gasRecommendation,
    isChainTypeSatisfied,
    nativeToken,
    toChainId,
  ]);

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
