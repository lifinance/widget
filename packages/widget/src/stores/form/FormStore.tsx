import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import { isItemAllowed, useWidgetConfig } from '../../providers/WidgetProvider';
import { FormValuesState } from './types';
import { createFormStore, formDefaultValues } from './createFormStore';
import { StoreApi } from 'zustand';
import { useAccount } from '@lifi/widget';

export type FormStoreStore = UseBoundStoreWithEqualityFn<
  StoreApi<FormValuesState>
>;
export const FormStoreContext = createContext<FormStoreStore | null>(null);

// TODO: needs to be removed - just using for testing
const StoreOutput = () => {
  const { defaultValues, userValues } = useFormStore();

  console.log('StoreOutput', defaultValues, userValues);

  return null;
};
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
      <StoreOutput />
      {children}
    </FormStoreContext.Provider>
  );
};

export const useFormStore = () => {
  const useStore = useContext(FormStoreContext);

  if (!useStore) {
    throw new Error(
      'You forgot to wrap your component in <FormStoreProvider>.',
    );
  }

  return useStore();
};

// TODO: to replace useController - for more complex considerations look at ./components/SendToWallet/SendToWallet.tsx
//   also consider the register used in packages/widget/src/pages/SelectTokenPage/SearchTokenInput.tsx
//   export const useFieldController
// TODO: Question: hook to replace useWatch - check the performance as currently is
//   zustand does have a subscription pattern might be able to apply this on a hook level
