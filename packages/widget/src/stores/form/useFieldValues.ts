import type { FormFieldNames } from './types';
import { useFormStore } from './FormStore';
import { shallow } from 'zustand/shallow';

export const useFieldValues = (...names: FormFieldNames[]) => {
  const values = useFormStore(
    (store) => names.map((name) => store.userValues[name]?.value),
    shallow,
  );

  return values;
};
