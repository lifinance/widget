/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import type { SwapFormValues } from '../SwapFormProvider';
import { SwapFormKey } from '../SwapFormProvider';
import { useWallet } from '../WalletProvider';
import { isItemAllowed, useWidgetConfig } from '../WidgetProvider';

export const FormUpdater: React.FC<{
  defaultValues: Partial<SwapFormValues>;
}> = ({ defaultValues }) => {
  const { fromChain, toChain, chains, disabledChains } = useWidgetConfig();
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
    const chainAllowed =
      account.chainId && isItemAllowed(account.chainId, chains, disabledChains);
    if (!account.isActive || !account.chainId || !chainAllowed) {
      return;
    }

    const { isTouched: isFromChainTouched } = getFieldState(
      SwapFormKey.FromChain,
    );
    const { isTouched: isToChainTouched } = getFieldState(SwapFormKey.ToChain);
    const { isTouched: isFromTokenTouched } = getFieldState(
      SwapFormKey.FromToken,
    );
    const { isTouched: isToTokenTouched } = getFieldState(SwapFormKey.ToToken);
    const { isTouched: isFromAmountTouched } = getFieldState(
      SwapFormKey.FromAmount,
    );

    if (!fromChain && !isFromChainTouched && !isFromTokenTouched) {
      setValue(SwapFormKey.FromChain, account.chainId);
      setValue(SwapFormKey.FromToken, '');
      if (isFromAmountTouched) {
        setValue(SwapFormKey.FromAmount, '');
      }
    }
    if (!toChain && !isToChainTouched && !isToTokenTouched) {
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

  // Makes widget config options reactive to changes
  // Acts similar to values property from useForm, but includes additional logic for chains
  useEffect(() => {
    (Object.keys(defaultValues) as SwapFormKey[]).forEach((key) => {
      if (previousDefaultValues.current[key] !== defaultValues[key]) {
        const value =
          defaultValues[key] ||
          // set the chain to the current user one if it is not present in the config
          (key === SwapFormKey.FromChain || key === SwapFormKey.ToChain
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
