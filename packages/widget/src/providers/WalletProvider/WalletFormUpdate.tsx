/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useChainOrderStore } from '../../stores';
import { SwapFormKey } from '../SwapFormProvider';
import { isItemAllowed, useWidgetConfig } from '../WidgetProvider';
import type { WalletAccount } from './types';

export const WalletFormUpdate: React.FC<{ account: WalletAccount }> = ({
  account,
}) => {
  const { fromChain, toChain, chains, disabledChains } = useWidgetConfig();
  const {
    setValue,
    getValues,
    getFieldState,
    // Subscription to dirtyFields is required by getFieldState to work
    formState: { dirtyFields },
  } = useFormContext();

  // Set wallet chain as default if no chains are provided by config and if they were not changed during widget usage
  useEffect(() => {
    const chainAllowed =
      account.chainId && isItemAllowed(account.chainId, chains, disabledChains);
    if (!account.isActive || !account.chainId || !chainAllowed) {
      return;
    }

    const [fromChainValue, toChainValue] = getValues([
      SwapFormKey.FromChain,
      SwapFormKey.ToChain,
    ]);

    const { isDirty: isFromChainDirty } = getFieldState(SwapFormKey.FromChain);
    const { isDirty: isToChainDirty } = getFieldState(SwapFormKey.ToChain);
    const { isDirty: isFromTokenDirty } = getFieldState(SwapFormKey.FromToken);
    const { isDirty: isToTokenDirty } = getFieldState(SwapFormKey.ToToken);
    const { isDirty: isFromAmountDirty } = getFieldState(
      SwapFormKey.FromAmount,
    );

    const { chainOrder, setChain } = useChainOrderStore.getState();

    // Users can switch chains in the wallet.
    // If we don't have a chain in the ordered chain list we should add it.
    setChain(account.chainId);

    // If we ran out of slots for the ordered chain list and the current chain isn't there
    // we should make a recently switched chain as current.
    const hasFromChainInOrderedList = chainOrder.includes(fromChainValue);
    const hasToChainInOrderedList = chainOrder.includes(toChainValue);

    if (
      (!fromChain && !isFromChainDirty && !isFromTokenDirty) ||
      !hasFromChainInOrderedList
    ) {
      setValue(SwapFormKey.FromChain, account.chainId);
      setValue(SwapFormKey.FromToken, '');
      if (isFromAmountDirty) {
        setValue(SwapFormKey.FromAmount, '');
      }
    }
    if (
      (!toChain && !isToChainDirty && !isToTokenDirty) ||
      !hasToChainInOrderedList
    ) {
      setValue(SwapFormKey.ToChain, account.chainId);
      setValue(SwapFormKey.ToToken, '');
    }
  }, [
    account.chainId,
    account.isActive,
    chains,
    disabledChains,
    fromChain,
    getFieldState,
    getValues,
    setValue,
    toChain,
  ]);

  return null;
};
