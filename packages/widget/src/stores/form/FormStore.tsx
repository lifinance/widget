import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { useWidgetConfig } from '../../providers';
import type { FormStoreStore, FormValuesState } from './types';
import { createFormStore, formDefaultValues } from './createFormStore';
import { FormUpdater } from './FormUpdater';

export const FormStoreContext = createContext<FormStoreStore | null>(null);

export const FormStoreProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const storeRef = useRef<FormStoreStore>();

  if (!storeRef.current) {
    storeRef.current = createFormStore();
  }

  const { fromChain, fromToken, fromAmount, toChain, toToken, toAddress } =
    useWidgetConfig();

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
      toAddress: toAddress || formDefaultValues.toAddress,
    }),
    [fromAmount, fromChain, fromToken, toAddress, toChain, toToken],
  );

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().setDefaultValues(defaultValues);
    }
  }, [defaultValues, storeRef.current]);

  return (
    <FormStoreContext.Provider value={storeRef.current}>
      <FormUpdater defaultValues={defaultValues} />
      {children}
    </FormStoreContext.Provider>
  );
};

export const useFormStore = (
  selector: (store: FormValuesState) => any,
  equalityFunction = shallow,
) => {
  const useStore = useContext(FormStoreContext);

  if (!useStore) {
    throw new Error(
      'You forgot to wrap your component in <FormStoreProvider>.',
    );
  }

  return useStore(selector, equalityFunction);
};
