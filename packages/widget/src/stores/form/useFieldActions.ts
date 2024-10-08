import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import type { widgetEvents } from '../../hooks/useWidgetEvents.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { WidgetEvent } from '../../types/events.js';
import type {
  DefaultValues,
  FormActions,
  FormFieldNames,
  GenericFormValue,
  SetOptions,
} from './types.js';
import { useFormStore } from './useFormStore.js';

interface FieldValueToEmittedEvents {
  [key: string]: (
    value: GenericFormValue,
    emitter: typeof widgetEvents,
  ) => void;
}

const fieldValueToEmittedEvents: FieldValueToEmittedEvents = {
  toAddress: (address, emitter) =>
    emitter.emit(WidgetEvent.SendToWalletAddressChanged, {
      address: address as string | undefined,
    }),
};

const emitEventForFieldValueChange = (
  fieldName: FormFieldNames,
  newValue: GenericFormValue,
  currenValue: GenericFormValue,
  emitter: typeof widgetEvents,
) => {
  const emitFunction = fieldValueToEmittedEvents[fieldName];

  // only emit a widget event if a mapping exists in fieldValueToEmittedEvents
  // and if the field value will change
  if (emitFunction && newValue !== currenValue) {
    emitFunction(newValue, emitter);
  }
};

export const useFieldActions = () => {
  const emitter = useWidgetEvents();
  const actions = useFormStore<FormActions>(
    (store) => ({
      getFieldValues: store.getFieldValues,
      isTouched: store.isTouched,
      resetField: store.resetField,
      setAsTouched: store.setAsTouched,
      setDefaultValues: store.setDefaultValues,
      setFieldValue: store.setFieldValue,
      setUserAndDefaultValues: store.setUserAndDefaultValues,
    }),
    shallow,
  );

  const setFieldValueWithEmittedEvents = useCallback(
    (
      fieldName: FormFieldNames,
      value: GenericFormValue,
      options?: SetOptions,
    ) => {
      emitEventForFieldValueChange(
        fieldName,
        value,
        actions.getFieldValues(fieldName)[0],
        emitter,
      );

      actions.setFieldValue(fieldName, value, options);
    },
    [actions, emitter],
  );

  const setUserAndDefaultValuesWithEmittedEvents = useCallback(
    (formValues: Partial<DefaultValues>) => {
      (Object.keys(formValues) as FormFieldNames[]).forEach((fieldName) => {
        emitEventForFieldValueChange(
          fieldName,
          formValues[fieldName],
          actions.getFieldValues(fieldName)[0],
          emitter,
        );
      });

      actions.setUserAndDefaultValues(formValues);
    },
    [actions, emitter],
  );

  return {
    ...actions,
    setFieldValue: setFieldValueWithEmittedEvents,
    setUserAndDefaultValues: setUserAndDefaultValuesWithEmittedEvents,
  };
};
