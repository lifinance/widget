import type { PropsWithChildren } from 'react';
import { useMemo, useRef } from 'react';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js';
import { useSendToWalletStore } from '../../stores/settings/useSendToWalletStore.js';
import type { FormApiRef, ToAddress } from '../../types/widget.js';
import { HiddenUI } from '../../types/widget.js';
import { FormStoreContext } from './FormStoreContext.js';
import { FormUpdater } from './FormUpdater.js';
import { createFormStore, formDefaultValues } from './createFormStore.js';
import type {
  DefaultValues,
  FormStoreStore,
  GenericFormValue,
} from './types.js';

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
  formApiRef?: FormApiRef;
}

export const FormStoreProvider: React.FC<FormStoreProviderProps> = ({
  children,
  formApiRef,
}) => {
  const widgetConfig = useWidgetConfig();
  const { setSendToWallet } = useSendToWalletStore();
  const { setSelectedBookmark } = useBookmarkActions();

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

    if (formApiRef) {
      const santiseValue: {
        [key: string]: (value: any) => GenericFormValue;
      } = {
        fromAmount: (value) =>
          (typeof value === 'number' ? value?.toPrecision() : value) ||
          formDefaultValues.fromAmount,
        toAddress: (value) => {
          if (hiddenToAddress) {
            return formDefaultValues.toAddress;
          }

          const isToAddressObj = typeof value !== 'string';

          const address =
            (isToAddressObj ? value?.address : value) ||
            formDefaultValues.toAddress;

          // sets the send to wallet button state to be open
          // if there is an address to display
          if (address) {
            setSendToWallet(address);
          }

          // we can assume that the toAddress has been passed as ToAddress object
          // and display it accordingly - this ensures that if a name is included
          // that it is displayed in the Send To Wallet form field correctly
          if (isToAddressObj) {
            setSelectedBookmark(value);
          }

          return address;
        },
      };

      formApiRef.current = {
        setFieldValue: (fieldName, value, options) => {
          const santisedValue = (
            santiseValue[fieldName] ? santiseValue[fieldName](value) : value
          ) as GenericFormValue;

          const fieldValueOptions = options
            ? { isTouched: options.setURLSearchParam }
            : undefined;

          storeRef.current
            ?.getState()
            .setFieldValue(fieldName, santisedValue, fieldValueOptions);
        },
      };
    }
  }

  return (
    <FormStoreContext.Provider value={storeRef.current}>
      {children}
      <FormUpdater reactiveFormValues={reactiveFormValues} />
    </FormStoreContext.Provider>
  );
};
