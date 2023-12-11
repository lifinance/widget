import { useCallback } from 'react';
import { FormFieldNames } from './types';
import { useFormStore } from './FormStore';

interface UseFieldControllerProps {
  name: FormFieldNames;
}

export const useFieldController = ({ name }: UseFieldControllerProps) => {
  const { userValues, setFieldValue, setAsTouched } = useFormStore();
  const fieldValue = userValues[name]?.value;

  const onChange = useCallback(
    (newValue: string | number | undefined) => {
      setFieldValue(name, newValue, { isDirty: true });
    },
    [name, setFieldValue],
  );

  const onBlur = useCallback(() => {
    setAsTouched(name);
  }, [name, setFieldValue]);

  return {
    onChange,
    onBlur,
    name,
    value: fieldValue,
  };
};
