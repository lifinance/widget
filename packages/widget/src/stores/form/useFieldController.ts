import { useCallback } from 'react';
import type { FormFieldNames } from './types';
import { useFieldValues } from './useFieldValues';
import { useFieldActions } from './useFieldActions';

interface UseFieldControllerProps {
  name: FormFieldNames;
}

export const useFieldController = ({ name }: UseFieldControllerProps) => {
  const [fieldValue] = useFieldValues(name);
  const { setFieldValue, setAsTouched } = useFieldActions();

  const onChange = useCallback(
    (newValue: string | number | undefined) => {
      setFieldValue(name, newValue, { isDirty: true });
    },
    [name, setFieldValue],
  );

  const onBlur = useCallback(() => {
    setAsTouched(name);
  }, [name, setAsTouched]);

  return {
    onChange,
    onBlur,
    name,
    value: fieldValue,
  };
};
