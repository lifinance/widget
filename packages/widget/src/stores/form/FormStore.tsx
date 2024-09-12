import type { PropsWithChildren } from 'react';
import { useMemo, useRef } from 'react';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { HiddenUI } from '../../types/widget.js';
import { FormStoreContext } from './FormStoreContext.js';
import { FormUpdater } from './FormUpdater.js';
import { createFormStore, formDefaultValues } from './createFormStore.js';
import type { FormStoreStore } from './types.js';

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
    formUpdateKey,
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
    // Using a randomly assigned unique key for formUpdateKey will force updates for the following field values
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      fromAmount,
      fromChain,
      fromToken,
      hiddenToAddress,
      toAddress,
      toChain,
      toToken,
      formUpdateKey,
    ],
  );

  if (!storeRef.current) {
    storeRef.current = createFormStore(defaultValues);
  }

  return (
    <FormStoreContext.Provider value={storeRef.current}>
      {children}
      <FormUpdater defaultValues={defaultValues} />
    </FormStoreContext.Provider>
  );
};
