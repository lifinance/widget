import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
// import { URLSearchParamsBuilder } from '../../stores/form/URLSearchParamsBuilder.js';
import { HiddenUI } from '../../types/widget.js';
import { formatInputAmount } from '../../utils/format.js';
import { FormStoreContext } from './FormStoreContext.js';
import { FormUpdater } from './FormUpdater.js';
import { createFormStore, formDefaultValues } from './createFormStore.js';
import type { DefaultValues, FormStoreStore } from './types.js';

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

export const FormStoreProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    toAddress,
    hiddenUI,
  } = useWidgetConfig();
  const storeRef = useRef<FormStoreStore>();

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);

  const defaultValues = useMemo(
    () => ({
      ...formDefaultValues,
      fromChain,
      fromToken,
      toChain,
      toToken,
      fromAmount:
        (typeof fromAmount === 'number'
          ? fromAmount?.toPrecision()
          : fromAmount) || formDefaultValues.fromAmount,
      // Prevent setting address when the field is hidden
      toAddress: hiddenToAddress
        ? formDefaultValues.toAddress
        : toAddress?.address || formDefaultValues.toAddress,
    }),
    [
      fromAmount,
      fromChain,
      fromToken,
      hiddenToAddress,
      toAddress,
      toChain,
      toToken,
    ],
  );

  if (!storeRef.current) {
    storeRef.current = createFormStore(defaultValues);
  }

  // TODO: try setting the values from the URL Search Params here with useEffect as we only want that to happen once
  useEffect(() => {
    const store = storeRef.current?.getState();

    const formValues = getDefaultValuesFromQueryString();

    store?.setUserAndDefaultValues(formValues);
  }, []);

  return (
    <FormStoreContext.Provider value={storeRef.current}>
      {children}
      <FormUpdater defaultValues={defaultValues} />
      {/*{buildUrl ? <URLSearchParamsBuilder /> : null}*/}
    </FormStoreContext.Provider>
  );
};
