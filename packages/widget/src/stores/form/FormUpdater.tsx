/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react';
import { useAccount } from '../../hooks/useAccount.js';
import { useChains } from '../../hooks/useChains.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import type { DefaultValues, FormFieldNames } from './types.js';
import { useFieldActions } from './useFieldActions.js';

export const FormUpdater: React.FC<{
  defaultValues: Partial<DefaultValues>;
}> = ({ defaultValues }) => {
  const { fromChain, toChain } = useWidgetConfig();
  const { account } = useAccount();
  const { chains } = useChains();
  const { isTouched, resetField, setFieldValue, getFieldValues } =
    useFieldActions();
  const previousDefaultValues = useRef(defaultValues);

  // Set wallet chain as default if no chains are provided by config and if they were not changed during widget usage
  useEffect(() => {
    const chainAllowed =
      account.chainId && chains?.some((chain) => chain.id === account.chainId);

    if (!account.isConnected || !account.chainId || !chainAllowed) {
      return;
    }

    if (!fromChain && !isTouched('fromChain') && !isTouched('fromToken')) {
      resetField('fromChain', { defaultValue: account.chainId });
      setFieldValue('fromToken', '');
      if (isTouched('fromAmount')) {
        setFieldValue('fromAmount', '');
      }
    }
    if (!toChain && !isTouched('toChain') && !isTouched('toToken')) {
      resetField('toChain', { defaultValue: account.chainId });
      setFieldValue('toToken', '');
    }
  }, [
    account.chainId,
    account.isConnected,
    chains,
    fromChain,
    toChain,
    isTouched,
    resetField,
    setFieldValue,
  ]);

  // Makes widget config options reactive to changes
  // should update userValues when defaultValues updates and includes additional logic for chains
  useEffect(() => {
    (Object.keys(defaultValues) as FormFieldNames[]).forEach((key) => {
      if (previousDefaultValues.current[key] !== defaultValues[key]) {
        const value =
          defaultValues[key] ||
          // set the chain to the current user one if it is not present in the config
          (key === 'fromChain' || key === 'toChain'
            ? account.chainId || ''
            : '');
        setFieldValue(key, value);
        resetField(key, { defaultValue: value });
      }
    });
    previousDefaultValues.current = defaultValues;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, getFieldValues, resetField, setFieldValue]);

  return null;
};
