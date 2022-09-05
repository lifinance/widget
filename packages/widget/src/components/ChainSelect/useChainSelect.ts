import type { EVMChain } from '@lifi/sdk';
import { useFormContext } from 'react-hook-form';
import { useChains } from '../../hooks';
import type { SwapFormDirection } from '../../providers';
import { SwapFormKey, SwapFormKeyHelper } from '../../providers';
import { useChainOrder } from '../../stores/chains';

export const useChainSelect = (formType: SwapFormDirection) => {
  const { setValue } = useFormContext();
  const { chains, isLoading } = useChains();
  const [chainOrder, setChainOrder] = useChainOrder();
  const chainKey = SwapFormKeyHelper.getChainKey(formType);

  const getChains = () => {
    if (!chains) {
      return [];
    }
    const selectedChains = chainOrder
      .map((chainId) => chains.find((chain) => chain.id === chainId))
      .filter((chain) => chain) as EVMChain[];

    return selectedChains;
  };

  const setCurrentChain = (chainId: number) => {
    setValue(chainKey, chainId, { shouldDirty: true });
    setValue(SwapFormKeyHelper.getTokenKey(formType), '', {
      shouldDirty: false,
    });
    setValue(SwapFormKeyHelper.getAmountKey(formType), '');
    setValue(SwapFormKey.TokenSearchFilter, '');
    setChainOrder(chainId);
  };

  return { chains, getChains, setCurrentChain, isLoading };
};
