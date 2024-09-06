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
  const config = useWidgetConfig();
  const storeRef = useRef<FormStoreStore>();

  const hiddenToAddress = config.hiddenUI?.includes(HiddenUI.ToAddress);

  const defaultValues = useMemo(
    () => ({
      ...formDefaultValues,
      fromChain: config.fromChain,
      fromToken: config.fromToken,
      toChain: config.toChain,
      toToken: config.toToken,
      fromAmount:
        (typeof config.fromAmount === 'number'
          ? config.fromAmount?.toPrecision()
          : config.fromAmount) || formDefaultValues.fromAmount,
      // Prevent setting address when the field is hidden
      toAddress: hiddenToAddress
        ? formDefaultValues.toAddress
        : config.toAddress?.address || formDefaultValues.toAddress,
    }),
    [config, hiddenToAddress],
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
