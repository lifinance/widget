import type { PropsWithChildren } from 'react';
import { useMemo, useRef } from 'react';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import type { FormRef, ToAddress } from '../../types/widget.js';
import { HiddenUI } from '../../types/widget.js';
import { FormStoreContext } from './FormStoreContext.js';
import { FormUpdater } from './FormUpdater.js';
import { createFormStore, formDefaultValues } from './createFormStore.js';
import type { DefaultValues, FormStoreStore } from './types.js';
import { useFormRef } from './useFormRef.js';

// decorates and initialise the form date for use in the form store
const intialiseDefaultValues = (
  defaultValues: Partial<DefaultValues>,
  fromAmount?: number | string,
  toAddress?: ToAddress,
  hiddenToAddress?: boolean,
) => ({
  ...formDefaultValues,
  ...defaultValues,
  fromAmount:
    (typeof fromAmount === 'number' ? fromAmount?.toPrecision() : fromAmount) ||
    formDefaultValues.fromAmount,
  // Prevent setting address when the field is hidden
  toAddress: hiddenToAddress
    ? formDefaultValues.toAddress
    : toAddress?.address || formDefaultValues.toAddress,
});

interface FormStoreProviderProps extends PropsWithChildren {
  formRef?: FormRef;
}

export const FormStoreProvider: React.FC<FormStoreProviderProps> = ({
  children,
  formRef,
}) => {
  const widgetConfig = useWidgetConfig();

  const {
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    toAddress,
    hiddenUI,
    formUpdateKey,
  } = widgetConfig;

  const storeRef = useRef<FormStoreStore>();

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);

  const configHasFromChain = widgetConfig.hasOwnProperty('fromChain');
  const configHasFromToken = widgetConfig.hasOwnProperty('fromToken');
  const configHasFromAmount = widgetConfig.hasOwnProperty('fromAmount');
  const configHasToAddress = widgetConfig.hasOwnProperty('toAddress');
  const configHasToChain = widgetConfig.hasOwnProperty('toChain');
  const configHasToToken = widgetConfig.hasOwnProperty('toToken');

  // We use the presence/absence of a property to decide if the form values in state need to be updated
  // We only build and set a property on the memoized form values here if they are included in the
  // config - undefined is considered a valid value that will reset that form field
  const reactiveFormValues = useMemo(
    () => ({
      ...(configHasFromChain ? { fromChain } : undefined),
      ...(configHasFromToken ? { fromToken } : undefined),
      ...(configHasFromAmount
        ? {
            fromAmount:
              (typeof fromAmount === 'number'
                ? fromAmount?.toPrecision()
                : fromAmount) || formDefaultValues.fromAmount,
          }
        : undefined),
      ...(configHasToChain ? { toChain } : undefined),
      ...(configHasToToken ? { toToken } : undefined),
      ...(configHasToAddress
        ? {
            toAddress: hiddenToAddress
              ? formDefaultValues.toAddress
              : toAddress?.address || formDefaultValues.toAddress,
          }
        : undefined),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      fromAmount,
      fromChain,
      fromToken,
      hiddenToAddress,
      toAddress,
      toChain,
      toToken,
      // formUpdateKey should be a randomly assigned unique key. It can be used to force updates for the form field values
      formUpdateKey,
      configHasFromChain,
      configHasFromToken,
      configHasFromAmount,
      configHasToAddress,
      configHasToChain,
      configHasToToken,
    ],
  );

  if (!storeRef.current) {
    storeRef.current = createFormStore(
      intialiseDefaultValues(
        reactiveFormValues,
        fromAmount,
        toAddress,
        hiddenToAddress,
      ),
    );
  }

  useFormRef(storeRef.current, formRef);

  return (
    <FormStoreContext.Provider value={storeRef.current}>
      {children}
      <FormUpdater reactiveFormValues={reactiveFormValues} />
    </FormStoreContext.Provider>
  );
};
