import { shallow } from 'zustand/shallow';
import { useFormStore } from './FormStore';
import type { ValidationActions } from './types';

export const useValidationActions = () => {
  const actions = useFormStore<ValidationActions>(
    (store) => ({
      addFieldValidation: store.addFieldValidation,
      triggerFieldValidation: store.triggerFieldValidation,
      clearErrors: store.clearErrors,
    }),
    shallow,
  );

  return actions;
};
