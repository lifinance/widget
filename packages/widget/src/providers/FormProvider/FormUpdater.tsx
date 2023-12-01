/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '.';
import { FormKey } from '.';
import { useWallet } from '../WalletProvider';
import { isItemAllowed, useWidgetConfig } from '../WidgetProvider';

export const FormUpdater: React.FC<{
  defaultValues: Partial<FormValues>;
}> = ({ defaultValues }) => {
  const { fromChain, toChain, chains } = useWidgetConfig();
  const { account } = useWallet();
  const {
    setValue,
    getValues,
    getFieldState,
    resetField,
    // Subscription to touchedFields is required by getFieldState to work
    formState: { touchedFields },
  } = useFormContext();

  const previousDefaultValues = useRef(defaultValues);

  // Set wallet chain as default if no chains are provided by config and if they were not changed during widget usage
  useEffect(() => {
    if (!account.isActive || !account.chainId) {
      return;
    }
    const chainAllowed = isItemAllowed(account.chainId, chains);
    if (!chainAllowed) {
      return;
    }

    const { isTouched: isFromChainTouched } = getFieldState(FormKey.FromChain);
    const { isTouched: isToChainTouched } = getFieldState(FormKey.ToChain);
    const { isTouched: isFromTokenTouched } = getFieldState(FormKey.FromToken);
    const { isTouched: isToTokenTouched } = getFieldState(FormKey.ToToken);
    const { isTouched: isFromAmountTouched } = getFieldState(
      FormKey.FromAmount,
    );

    if (!fromChain && !isFromChainTouched && !isFromTokenTouched) {
      resetField(FormKey.FromChain, { defaultValue: account.chainId });
      setValue(FormKey.FromChain, account.chainId);
      setValue(FormKey.FromToken, '');
      if (isFromAmountTouched) {
        setValue(FormKey.FromAmount, '');
      }
    }
    if (!toChain && !isToChainTouched && !isToTokenTouched) {
      resetField(FormKey.ToChain, { defaultValue: account.chainId });
      setValue(FormKey.ToChain, account.chainId);
      setValue(FormKey.ToToken, '');
    }
  }, [
    account.chainId,
    account.isActive,
    chains,
    fromChain,
    getFieldState,
    getValues,
    resetField,
    setValue,
    toChain,
  ]);

  // Makes widget config options reactive to changes
  // Acts similar to values property from useForm, but includes additional logic for chains
  useEffect(() => {
    (Object.keys(defaultValues) as FormKey[]).forEach((key) => {
      if (previousDefaultValues.current[key] !== defaultValues[key]) {
        const value =
          defaultValues[key] ||
          // set the chain to the current user one if it is not present in the config
          (key === FormKey.FromChain || key === FormKey.ToChain
            ? account.chainId || ''
            : '');
        setValue(key, value);
        resetField(key, { defaultValue: value });
      }
    });
    previousDefaultValues.current = defaultValues;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, getValues, resetField, setValue]);

  return null;
};
