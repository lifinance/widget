import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { isItemAllowed, useWidgetConfig } from '../../providers/WidgetProvider';
import { FormStoreStore, FormValuesState } from './types';
import { createFormStore, formDefaultValues } from './createFormStore';
import { useAccount } from '@lifi/widget';
import { shallow } from 'zustand/shallow';

export const FormStoreContext = createContext<FormStoreStore | null>(null);

export const FormStoreProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const storeRef = useRef<FormStoreStore>();

  if (!storeRef.current) {
    storeRef.current = createFormStore();
  }

  const {
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    toAddress,
    chains,
  } = useWidgetConfig();

  const { account } = useAccount();

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().setDefaultValues({
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
      });
    }
  }, [
    fromAmount,
    fromChain,
    fromToken,
    toAddress,
    toChain,
    toToken,
    storeRef.current,
  ]);

  // TODO: pull this out into a seperate component
  useEffect(() => {
    const chainAllowed =
      account.chainId && isItemAllowed(account.chainId, chains);
    if (!account.isConnected || !account.chainId || !chainAllowed) {
      return;
    }

    if (storeRef.current) {
      const { isTouched, resetField, setFieldValue } =
        storeRef.current.getState();

      if (!fromChain && !isTouched('fromChain') && !isTouched('fromToken')) {
        resetField('fromChain', { defaultValue: account.chainId });
        setFieldValue('fromToken', '');
        if (isTouched('fromAmount')) {
          setFieldValue('fromAmount', '');
        }
      }
      if (!toChain && !isTouched('toChain') && !isTouched('toToken')) {
        resetField('toChain', { defaultValue: account.chainId });
        setFieldValue('toToken', '');
      }
    }
  }, [
    storeRef.current,
    account.chainId,
    account.isConnected,
    fromChain,
    toChain,
  ]);

  return (
    <FormStoreContext.Provider value={storeRef.current}>
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
