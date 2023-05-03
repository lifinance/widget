import type { EVMChain } from '@lifi/sdk';
import { useController, useFormContext } from 'react-hook-form';
import { useChains, useSwapOnly } from '../../hooks';
import type { SwapFormType } from '../../providers';
import { SwapFormKey, SwapFormKeyHelper } from '../../providers';
import { useChainOrder } from '../../stores';

export const useChainSelect = (formType: SwapFormType) => {
  const chainKey = SwapFormKeyHelper.getChainKey(formType);
  const {
    field: { onChange, onBlur },
  } = useController({ name: chainKey });
  const { setValue } = useFormContext();
  const { chains, isLoading } = useChains();
  const [chainOrder, setChainOrder] = useChainOrder();
  const swapOnly = useSwapOnly();

  const getChains = () => {
    if (!chains) {
      return [];
    }
    const selectedChains = chainOrder
      .map((chainId) => chains.find((chain) => chain.id === chainId))
      .filter(Boolean) as EVMChain[];

    return selectedChains;
  };

  const setCurrentChain = (chainId: number) => {
    onChange(chainId);
    onBlur();
    if (swapOnly) {
      setValue(SwapFormKeyHelper.getChainKey('to'), chainId, {
        shouldTouch: true,
      });
    }
    setValue(SwapFormKeyHelper.getTokenKey(formType), '');
    setValue(SwapFormKeyHelper.getAmountKey(formType), '');
    setValue(SwapFormKey.TokenSearchFilter, '');
    setChainOrder(chainId);
  };

  return {
    chainOrder,
    chains,
    getChains,
    isLoading,
    setChainOrder,
    setCurrentChain,
  };
};
