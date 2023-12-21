import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { useWidgetConfig } from '../../providers';
import { FormUpdater } from './FormUpdater';
import { createFormStore, formDefaultValues } from './createFormStore';
import type { FormStoreStore, FormValuesState } from './types';

export const FormStoreContext = createContext<FormStoreStore | null>(null);

export const FormStoreProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { fromChain, fromToken, fromAmount, toChain, toToken, toAddress } =
    useWidgetConfig();
  const storeRef = useRef<FormStoreStore>();

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

  if (!storeRef.current) {
    storeRef.current = createFormStore(defaultValues);
  }

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
      `You forgot to wrap your component in <${FormStoreProvider.name}>.`,
    );
  }

  return useStore(selector, equalityFunction);
};
