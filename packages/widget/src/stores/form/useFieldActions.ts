import { shallow } from 'zustand/shallow';
import type { FormActions } from './types.js';
import { useFormStore } from './useFormStore.js';

export const useFieldActions = () => {
  const actions = useFormStore<FormActions>(
    (store) => ({
      getFieldValues: store.getFieldValues,
      isTouched: store.isTouched,
      resetField: store.resetField,
      setAsTouched: store.setAsTouched,
      setDefaultValues: store.setDefaultValues,
      setFieldValue: store.setFieldValue,
    }),
    shallow,
  );

  return actions;
};
