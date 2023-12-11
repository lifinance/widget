import { FormFieldNames } from './types';
import { useFormStore } from './FormStore';

// TODO: Question: a memozise singlular useFieldValue would be very easy to write - worth doing?
export const useFieldValues = (...names: FormFieldNames[]) => {
  const { userValues } = useFormStore();

  return names.map((name) => userValues[name]?.value as any);
};
