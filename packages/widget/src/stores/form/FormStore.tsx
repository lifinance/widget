import type { PropsWithChildren } from 'react';
import { useMemo, useRef } from 'react';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { HiddenUI } from '../../types/widget.js';
import { createFormStore, formDefaultValues } from './createFormStore.js';
import { FormStoreContext } from './FormStoreContext.js';
import { FormUpdater } from './FormUpdater.js';
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

  return (
    <FormStoreContext.Provider value={storeRef.current}>
      {children}
      <FormUpdater defaultValues={defaultValues} />
    </FormStoreContext.Provider>
  );
};
