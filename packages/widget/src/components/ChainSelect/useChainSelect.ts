import type { EVMChain } from '@lifi/sdk';
import { useChains, useSwapOnly } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import type { FormType } from '../../stores';
import {
  FormKeyHelper,
  useChainOrder,
  useFieldActions,
  useFieldController,
} from '../../stores';
import { RequiredUI } from '../../types';

export const useChainSelect = (formType: FormType) => {
  const { requiredUI } = useWidgetConfig();
  const chainKey = FormKeyHelper.getChainKey(formType);
  const { onChange, onBlur } = useFieldController({ name: chainKey });

  const { setFieldValue, getFieldValues } = useFieldActions();
  const { chains, isLoading, getChainById } = useChains(formType);
  const [chainOrder, setChainOrder] = useChainOrder(formType);
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
      setFieldValue(FormKeyHelper.getChainKey('to'), chainId, {
        isTouched: true,
      });
    }
    setFieldValue(FormKeyHelper.getTokenKey(formType), '');
    setFieldValue(FormKeyHelper.getAmountKey(formType), '');
    setFieldValue('tokenSearchFilter', '');

    const [fromChainId, toChainId] = getFieldValues('fromChain', 'toChain');

    const fromChain = getChainById(fromChainId);
    const toChain = getChainById(toChainId);

    const differentChainType =
      fromChain && toChain && fromChain.chainType !== toChain.chainType;

    const requiredToAddress =
      requiredUI?.includes(RequiredUI.ToAddress) || differentChainType;

    // toAddress field is required (always visible) when bridging between
    // two ecosystems (fromChain and toChain have different chain types).
    // We clean up toAddress on every chain change if toAddress is not required.
    // This is used when we switch between different chain ecosystems (chain types) and
    // prevents cases when after we switch the chain from one type to another "Send to wallet" field hides,
    // but it keeps toAddress value set for the previous chain pair.
    if (!requiredToAddress) {
      setFieldValue('toAddress', '');
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
