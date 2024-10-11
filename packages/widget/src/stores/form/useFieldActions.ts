import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
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
      const oldValue = actions.getFieldValues(fieldName)[0];

      actions.setFieldValue(fieldName, value, options);

      if (value !== oldValue) {
        emitter.emit(WidgetEvent.FormFieldChanged, {
          fieldName,
          value,
          oldValue,
        });
      }
    },
    [actions, emitter],
  );

  const setUserAndDefaultValuesWithEmittedEvents = useCallback(
    (formValues: Partial<DefaultValues>) => {
      const formValuesKeys = Object.keys(formValues) as FormFieldNames[];

      const changedValues = formValuesKeys.reduce(
        (accum, fieldName) => {
          const oldValue = actions.getFieldValues(fieldName)[0];
          const value = formValues[fieldName];

          if (value !== oldValue) {
            accum.push({ fieldName, value, oldValue });
          }

          return accum;
        },
        [] as {
          fieldName: FormFieldNames;
          value: GenericFormValue;
          oldValue: GenericFormValue;
        }[],
      );

      actions.setUserAndDefaultValues(formValues);

      changedValues.forEach(({ fieldName, value, oldValue }) => {
        emitter.emit(WidgetEvent.FormFieldChanged, {
          fieldName,
          value,
          oldValue,
        });
      });
    },
    [actions, emitter],
  );

  return {
    ...actions,
    setFieldValue: setFieldValueWithEmittedEvents,
    setUserAndDefaultValues: setUserAndDefaultValuesWithEmittedEvents,
  };
};
