import { useChain } from '../hooks/useChain.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { useFieldValues } from '../stores/form/useFieldValues.js';
import { RequiredUI } from '../types/widget.js';

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
