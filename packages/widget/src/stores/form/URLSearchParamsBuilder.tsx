import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { FormFieldNames } from '../index';
import { useFieldValues, useTouchedFields } from '../index';

const formValueKeys: FormFieldNames[] = [
  'fromAmount',
  'fromChain',
  'fromToken',
  'toAddress',
  'toChain',
  'toToken',
];
export const URLSearchParamsBuilder = () => {
  const { pathname } = useLocation();
  const touchedFields = useTouchedFields();
  const values = useFieldValues(...formValueKeys);

  useEffect(() => {
    const url = new URL(window.location as any);
    formValueKeys.forEach((key, index) => {
      if (touchedFields[key] && values[index]) {
        url.searchParams.set(key, values[index]);
      } else if (url.searchParams.has(key) && !values[index]) {
        url.searchParams.delete(key);
      }
    });
    url.searchParams.sort();
    window.history.replaceState(window.history.state, '', url);
  }, [pathname, touchedFields, values]);

  return null;
};
