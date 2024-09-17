import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSendToWalletActions } from '../../stores/settings/useSendToWalletStore.js';
import { formatInputAmount } from '../../utils/format.js';
import type { DefaultValues, FormFieldNames } from '../form/types.js';
import { useFieldActions } from '../form/useFieldActions.js';
import { useFieldValues } from '../form/useFieldValues.js';
import { useTouchedFields } from '../form/useTouchedFields.js';

const formValueKeys: FormFieldNames[] = [
  'fromAmount',
  'fromChain',
  'fromToken',
  'toAddress',
  'toChain',
  'toToken',
];

const getDefaultValuesFromQueryString = (): Partial<DefaultValues> => {
  const searchParams = Object.fromEntries(
    new URLSearchParams(window?.location.search),
  );

  // Prevent using fromToken/toToken params if chain is not selected
  ['from', 'to'].forEach((key) => {
    if (searchParams[`${key}Token`] && !searchParams[`${key}Chain`]) {
      delete searchParams[`${key}Token`];
    }
  });

  return {
    ...(Number.isFinite(parseInt(searchParams.fromChain, 10))
      ? { fromChain: parseInt(searchParams.fromChain, 10) }
      : {}),
    ...(Number.isFinite(parseInt(searchParams.toChain, 10))
      ? { toChain: parseInt(searchParams.toChain, 10) }
      : {}),
    ...(searchParams.fromToken ? { fromToken: searchParams.fromToken } : {}),
    ...(searchParams.toToken ? { toToken: searchParams.toToken } : {}),
    ...(Number.isFinite(parseFloat(searchParams.fromAmount))
      ? { fromAmount: formatInputAmount(searchParams.fromAmount) }
      : {}),
    ...(searchParams.toAddress ? { toAddress: searchParams.toAddress } : {}),
  };
};

export const URLSearchParamsBuilder = () => {
  const { pathname } = useLocation();
  const touchedFields = useTouchedFields();
  const values = useFieldValues(...formValueKeys);
  const { setSendToWallet } = useSendToWalletActions();

  // Using these methods as trying to use the touchedFields and values above
  // often has a lag that can effect the widgets initialisation sequence
  // and accidentally cause values to be wiped from the query string
  const { getFieldValues, isTouched, setUserAndDefaultValues } =
    useFieldActions();

  useEffect(() => {
    // get the  initial values from the querysting
    const formValues = getDefaultValuesFromQueryString();

    if (formValues.toAddress) {
      setSendToWallet(true);
    }

    setUserAndDefaultValues(formValues);
  }, [setUserAndDefaultValues, setSendToWallet]);

  useEffect(() => {
    // set the values on the querysting
    const url = new URL(window.location as any);
    formValueKeys.forEach((key, index) => {
      const value = getFieldValues(key)[0];
      if (isTouched(key) && value) {
        url.searchParams.set(key, value.toString());
      } else if (url.searchParams.has(key) && !value) {
        url.searchParams.delete(key);
      }
    });
    url.searchParams.sort();
    window.history.replaceState(window.history.state, '', url);
  }, [pathname, touchedFields, values, isTouched, getFieldValues]);

  return null;
};
