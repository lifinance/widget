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

  const requiredChainType =
    !!fromToken && !!toToken && !!fromChain && !!toChain && toChain.chainType;

  const differentChainType =
    !!requiredChainType && fromChain.chainType !== toChain.chainType;

  const requiredToAddress =
    requiredUI?.includes(RequiredUI.ToAddress) || differentChainType;

  return {
    requiredToAddress,
    requiredChainType,
  };
};
