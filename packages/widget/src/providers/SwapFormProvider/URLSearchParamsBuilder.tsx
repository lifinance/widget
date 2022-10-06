import { useEffect, useRef } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { SwapFormKey } from './types';

const formValueKeys = [
  SwapFormKey.FromAmount,
  SwapFormKey.FromChain,
  SwapFormKey.FromToken,
  SwapFormKey.ToAddress,
  SwapFormKey.ToChain,
  SwapFormKey.ToToken,
];

const replcateUrlState = (urlSearchParams?: URLSearchParams) => {
  if (!urlSearchParams) {
    return;
  }
  const url = new URL(window.location as any);
  urlSearchParams.forEach((value, key) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState(null, '', url);
};

export const URLSearchParamsBuilder = () => {
  const { pathname } = useLocation();
  const urlSearchParamsRef = useRef<URLSearchParams>();
  const { dirtyFields } = useFormState();
  const values = useWatch({ name: formValueKeys });

  useEffect(() => {
    const urlSearchParams = new URLSearchParams();
    formValueKeys.forEach((key, index) => {
      if (dirtyFields[key]) {
        urlSearchParams.set(key, values[index] || '');
      }
    });
    replcateUrlState(urlSearchParams);
    urlSearchParamsRef.current = urlSearchParams;
  }, [dirtyFields, values]);

  useEffect(() => {
    replcateUrlState(urlSearchParamsRef.current);
  }, [pathname]);

  return null;
};
