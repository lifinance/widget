import { FormFieldNames } from './types';
import { useFormStore } from './FormStore';

// TODO: Question: a memozised singlular useFieldValue would be very easy to write - worth doing? see below
export const useFieldValues = (...names: FormFieldNames[]) => {
  const { userValues } = useFormStore();

  return names.map((name) => userValues[name]?.value as any);
};

// export const useFieldValue = (name: FormFieldNames) => {
//   const fieldValue = useFormStore((store) => store.userData[name]?.value);
//
//   // may not need useMemo if the right equality check is done in zustand?
//   const memozisedFieldValue = useMemo(() => fieldValue, [fieldValue])
//
//   return memozisedFieldValue;
// };
