import { useWatch } from 'react-hook-form';
import { useChain } from '../hooks';
import { FormKey, useWidgetConfig } from '../providers';
import { RequiredUI } from '../types';

export const useRequiredToAddress = () => {
  const { requiredUI } = useWidgetConfig();
  const [fromChainId, toChainId] = useWatch({
    name: [FormKey.FromChain, FormKey.ToChain],
  });

  const { chain: fromChain } = useChain(fromChainId);
  const { chain: toChain } = useChain(toChainId);

  const differentChainType =
    fromChain && toChain && fromChain.chainType !== toChain.chainType;

  const requiredToAddress =
    requiredUI?.includes(RequiredUI.ToAddress) || differentChainType;

  return requiredToAddress;
};
