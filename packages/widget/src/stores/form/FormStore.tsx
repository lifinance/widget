import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { useWidgetConfig } from '../../providers';
import { HiddenUI } from '../../types';
import { FormUpdater } from './FormUpdater';
import { createFormStore, formDefaultValues } from './createFormStore';
import type { FormStoreStore, FormValuesState } from './types';

export const FormStoreContext = createContext<FormStoreStore | null>(null);

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
      <FormUpdater defaultValues={defaultValues}>{children}</FormUpdater>
    </FormStoreContext.Provider>
  );
};

export function useFormStore<T>(
  selector: (state: FormValuesState) => T,
  equalityFn = shallow,
): T {
  const useStore = useContext(FormStoreContext);

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${FormStoreProvider.name}>.`,
    );
  }

  return useStore(selector, equalityFn);
}
