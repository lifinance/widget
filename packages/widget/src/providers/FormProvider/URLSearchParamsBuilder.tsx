import { useEffect } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { FormKey } from './types';

const formValueKeys = [
  FormKey.FromAmount,
  FormKey.FromChain,
  FormKey.FromToken,
  FormKey.ToAddress,
  FormKey.ToChain,
  FormKey.ToToken,
];

export const URLSearchParamsBuilder = () => {
  const { pathname } = useLocation();
  const {
    // Have to use touchedFields, because default values are not considered dirty
    touchedFields: { ...touchedFields },
  } = useFormState();
  const values = useWatch({ name: formValueKeys });

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
