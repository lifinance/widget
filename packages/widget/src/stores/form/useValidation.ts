import { shallow } from 'zustand/shallow';
import type { ValidationProps } from './types.js';
import { useFormStore } from './useFormStore.js';
export const useValidation = (): Omit<ValidationProps, 'validation'> => {
  const [isValid, isValidating, errors] = useFormStore(
    (store) => [store.isValid, store.isValidating, store.errors],
    shallow,
  );

  return {
    isValid,
    isValidating,
    errors,
  };
};
