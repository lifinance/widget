import { useCallback } from 'react';
import type { FormFieldNames } from './types.js';
import { useFieldActions } from './useFieldActions.js';
import { useFieldValues } from './useFieldValues.js';

interface UseFieldControllerProps {
  name: FormFieldNames;
}

export const useFieldController = ({ name }: UseFieldControllerProps) => {
  const [fieldValue] = useFieldValues(name);
  const { setFieldValue, setAsTouched } = useFieldActions();

  const onChange = useCallback(
    (newValue: string | number | undefined) => {
      setFieldValue(name, newValue, { isDirty: true, isTouched: true });
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
