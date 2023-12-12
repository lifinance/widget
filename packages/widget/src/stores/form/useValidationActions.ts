import type { ValidationActions } from './types';
import { useFormStore } from './FormStore';
import { shallow } from 'zustand/shallow';
export const useValidationActions = (): ValidationActions => {
  const [addFieldValidation, triggerFieldValidation, clearErrors] =
    useFormStore(
      (store) => [
        store.clearErrors,
        store.triggerFieldValidation,
        store.clearErrors,
      ],
      shallow,
    );

  return {
    addFieldValidation,
    triggerFieldValidation,
    clearErrors,
  };
};
