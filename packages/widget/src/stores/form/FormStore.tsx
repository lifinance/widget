import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { isItemAllowed, useWidgetConfig } from '../../providers/WidgetProvider';
import { FormStoreStore } from './types';
import { createFormStore, formDefaultValues } from './createFormStore';
import { useAccount } from '@lifi/widget';

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

// TODO: needs to deal with errors, triggers (re trigger validation)
//  clearErrors from React Hook Form is used - components/SendToWallet/SendToWallet.tsx
//  trigger is used to trigger validation - components/SendToWallet/SendToWallet.tsx

// TODO: Question: I think we should try to optimise in places by introducing and optional selector funciton here
//  useFormStore = (selectorFn = (store) => store) => { ...
//  ... return useStore(selectorFn);
//  at points of user
//  const userValues = useFormStore((store) =>  store.userValues);
export const useFormStore = () => {
  const useStore = useContext(FormStoreContext);

  if (!useStore) {
    throw new Error(
      'You forgot to wrap your component in <FormStoreProvider>.',
    );
  }

  return useStore();
};
