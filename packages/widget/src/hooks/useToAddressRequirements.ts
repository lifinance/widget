import { useChain } from '../hooks';
import { useWidgetConfig } from '../providers';
import { RequiredUI } from '../types';
import { useFieldValues } from '../stores';

export const useToAddressRequirements = () => {
  const { requiredUI } = useWidgetConfig();
  const [fromChainId, toChainId, fromToken, toToken] = useFieldValues(
    'fromChain',
    'toChain',
    'fromToken',
    'toToken',
  );

  const { chain: fromChain } = useChain(fromChainId);
  const { chain: toChain } = useChain(toChainId);

  const isChainTypeCheckRequired =
    !!fromToken && !!toToken && !!fromChain && !!toChain;

  const requiredToChainType = isChainTypeCheckRequired
    ? toChain.chainType
    : undefined;

  const isDifferentChainType =
    isChainTypeCheckRequired && fromChain.chainType !== toChain.chainType;

  const requiredToAddress =
    requiredUI?.includes(RequiredUI.ToAddress) || isDifferentChainType;

  return {
    requiredToAddress,
    requiredToChainType,
  };
};
