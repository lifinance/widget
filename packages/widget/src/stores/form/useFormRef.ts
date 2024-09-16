import type { FormRef, FormValuesState, GenericFormValue } from '@lifi/widget';
import { HiddenUI } from '@lifi/widget';
import { useImperativeHandle } from 'react';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js';
import { formDefaultValues } from '../../stores/form/createFormStore.js';
import { useSendToWalletStore } from '../../stores/settings/useSendToWalletStore.js';

export const useFormRef = (formStore: FormValuesState, formRef?: FormRef) => {
  const { setSendToWallet } = useSendToWalletStore();
  const { setSelectedBookmark } = useBookmarkActions();
  const { hiddenUI } = useWidgetConfig();

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);

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

  useImperativeHandle(formRef, () => {
    return {
      setFieldValue: (fieldName, value, options) => {
        const santisedValue = (
          santiseValue[fieldName] ? santiseValue[fieldName](value) : value
        ) as GenericFormValue;

        const fieldValueOptions = options
          ? { isTouched: options.setURLSearchParam }
          : undefined;

        formStore.setFieldValue(fieldName, santisedValue, fieldValueOptions);
      },
    };
  });
};
