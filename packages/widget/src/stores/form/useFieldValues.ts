import { FormFieldNames } from './types';
import { useFormStore } from './FormStore';

export const useFieldValues = (...names: FormFieldNames[]) => {
  const { userValues } = useFormStore();

  return names.map((name) => userValues[name]?.value as any);
};
