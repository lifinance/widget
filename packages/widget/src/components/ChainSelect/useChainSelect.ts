import type { EVMChain } from '@lifi/sdk';
import { useFormContext } from 'react-hook-form';
import { useChains } from '../../hooks';
import type { SwapFormType } from '../../providers';
import { SwapFormKey, SwapFormKeyHelper } from '../../providers';
import { useChainOrder } from '../../stores';

export const useChainSelect = (formType: SwapFormType) => {
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
    setValue(SwapFormKeyHelper.getTokenKey(formType), '');
    setValue(SwapFormKeyHelper.getAmountKey(formType), '');
    setValue(SwapFormKey.TokenSearchFilter, '');
    setChainOrder(chainId);
  };

  return { chains, getChains, setCurrentChain, isLoading };
};
