import type { EVMChain } from '@lifi/sdk';
import { useChains, useSwapOnly, useToAddressReset } from '../../hooks';
import type { FormType } from '../../stores';
import {
  FormKeyHelper,
  useChainOrder,
  useFieldActions,
  useFieldController,
} from '../../stores';

export const useChainSelect = (formType: FormType) => {
  const chainKey = FormKeyHelper.getChainKey(formType);
  const { onChange, onBlur } = useFieldController({ name: chainKey });

  const { setFieldValue, getFieldValues } = useFieldActions();
  const { chains, isLoading, getChainById } = useChains(formType);
  const [chainOrder, setChainOrder] = useChainOrder(formType);
  const swapOnly = useSwapOnly();
  const { tryResetToAddress } = useToAddressReset();

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
      setFieldValue(FormKeyHelper.getChainKey('to'), chainId, {
        isTouched: true,
      });
    }
    setFieldValue(FormKeyHelper.getTokenKey(formType), '');
    setFieldValue(FormKeyHelper.getAmountKey(formType), '');
    setFieldValue('tokenSearchFilter', '');

    const [toChainId] = getFieldValues('toChain');
    const toChain = getChainById(toChainId);
    if (toChain) {
      tryResetToAddress(toChain);
    }
    setChainOrder(chainId, formType);
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
