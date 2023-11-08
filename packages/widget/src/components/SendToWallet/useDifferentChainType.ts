import { useWatch } from 'react-hook-form';
import { useChain } from '../../hooks';
import { FormKey } from '../../providers';

export const useDifferentChainType = () => {
  const [fromChainId, toChainId] = useWatch({
    name: [FormKey.FromChain, FormKey.ToChain],
  });

  const { chain: fromChain } = useChain(fromChainId);
  const { chain: toChain } = useChain(toChainId);

  const differentChainType =
    fromChain && toChain && fromChain.chainType !== toChain.chainType;

  return differentChainType;
};
