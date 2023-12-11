import { useChain } from '../hooks';
import { useWidgetConfig } from '../providers';
import { RequiredUI } from '../types';
import { useFieldValues } from '../stores';

export const useRequiredToAddress = () => {
  const { requiredUI } = useWidgetConfig();
  const [fromChainId, toChainId] = useFieldValues('fromChain', 'toChain');

  const { chain: fromChain } = useChain(fromChainId);
  const { chain: toChain } = useChain(toChainId);

  const differentChainType =
    fromChain && toChain && fromChain.chainType !== toChain.chainType;

  const requiredToAddress =
    requiredUI?.includes(RequiredUI.ToAddress) || differentChainType;

  return requiredToAddress;
};
