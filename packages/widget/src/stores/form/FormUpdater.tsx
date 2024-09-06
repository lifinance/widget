/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useAccount } from '../../hooks/useAccount.js';
import { useChains } from '../../hooks/useChains.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { formDefaultValues } from '../../stores/form/createFormStore.js';
import type { DefaultValues } from './types.js';
import { useFieldActions } from './useFieldActions.js';

export const FormUpdater: React.FC<{
  defaultValues: Partial<DefaultValues>;
}> = ({ defaultValues }) => {
  const { fromChain, toChain } = useWidgetConfig();
  const { account } = useAccount();
  const { chains } = useChains();
  const {
    isTouched,
    resetField,
    setFieldValue,
    getFieldValues,
    setUserAndDefaultValues,
  } = useFieldActions();
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
    console.log(
      'set values from config: formupdater',
      removeEmptyValuesProperties(defaultValues),
    );

    // TODO: consider using null in the config to specify when a value should be set to its default
    //  look at using formDefaultValues for this
    // TODO: if toAddress is set the Send to wallet section should be open
    setUserAndDefaultValues(removeEmptyValuesProperties(defaultValues));
  }, [
    defaultValues,
    getFieldValues,
    resetField,
    setFieldValue,
    setUserAndDefaultValues,
  ]);

  return null;
};

const removeEmptyValuesProperties = (defaultValues: Partial<DefaultValues>) => {
  const result: Partial<DefaultValues> = { ...defaultValues };
  for (const key in result) {
    const k = key as keyof DefaultValues;
    if (result[k] === formDefaultValues[k]) {
      delete result[k];
    }
  }
  return result;
};
