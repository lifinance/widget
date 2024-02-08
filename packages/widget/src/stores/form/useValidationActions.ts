import { shallow } from 'zustand/shallow';
import type { ValidationActions } from './types.js';
import { useFormStore } from './useFormStore.js';

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
