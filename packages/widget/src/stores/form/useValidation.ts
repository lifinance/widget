import type { ValidationProps } from './types';
import { useFormStore } from './FormStore';
import { shallow } from 'zustand/shallow';
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
