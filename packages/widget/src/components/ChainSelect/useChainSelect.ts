import type { EVMChain } from '@lifi/sdk';
import { useController, useFormContext } from 'react-hook-form';
import { useChains, useSwapOnly } from '../../hooks';
import type { FormType } from '../../providers';
import { FormKey, FormKeyHelper, useWidgetConfig } from '../../providers';
import { useChainOrder } from '../../stores';
import { RequiredUI } from '../../types';

export const useChainSelect = (formType: FormType) => {
  const { requiredUI } = useWidgetConfig();
  const chainKey = FormKeyHelper.getChainKey(formType);
  const {
    field: { onChange, onBlur },
  } = useController({ name: chainKey });
  const { setValue, getValues } = useFormContext();
  const { chains, isLoading, getChainById } = useChains();
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
      setValue(FormKeyHelper.getChainKey('to'), chainId, {
        shouldTouch: true,
      });
    }
    setValue(FormKeyHelper.getTokenKey(formType), '');
    setValue(FormKeyHelper.getAmountKey(formType), '');
    setValue(FormKey.TokenSearchFilter, '');

    const [fromChainId, toChainId] = getValues([
      FormKey.FromChain,
      FormKey.ToChain,
    ]);

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
      setValue(FormKey.ToAddress, '');
    }
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
