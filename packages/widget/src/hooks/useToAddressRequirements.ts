import { useChain } from '../hooks';
import { useWidgetConfig } from '../providers';
import { useFieldValues } from '../stores';
import { RequiredUI } from '../types';

export const useToAddressRequirements = () => {
  const { requiredUI } = useWidgetConfig();
  const [fromChainId, toChainId] = useFieldValues('fromChain', 'toChain');

  const { chain: fromChain } = useChain(fromChainId);
  const { chain: toChain } = useChain(toChainId);

  const isDifferentChainType =
    fromChain && toChain && fromChain.chainType !== toChain.chainType;

  const requiredToAddress =
    requiredUI?.includes(RequiredUI.ToAddress) || isDifferentChainType;

  return {
    requiredToAddress,
    requiredToChainType: toChain?.chainType,
  };
};
