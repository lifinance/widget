import { shallow } from 'zustand/shallow';
import { useFormStore } from './FormStore';
import type { FormActions } from './types';

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
