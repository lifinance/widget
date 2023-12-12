import { shallow } from 'zustand/shallow';
import type {
  FormActions,
  FormActionsNames,
  FormActionsFunctions,
} from './types';
import { useFormStore } from './FormStore';

const actionFunctions: FormActionsNames[] = [
  'setDefaultValues',
  'isTouched',
  'setAsTouched',
  'resetField',
  'setFieldValue',
  'getFieldValues',
];

export const useFieldActions = (): FormActions => {
  const actions: FormActionsFunctions = useFormStore(
    (store) => actionFunctions.map((actionName) => store[actionName]),
    shallow,
  );

  return actions.reduce(
    (accum, actionName, i) => ({ ...accum, [actionFunctions[i]]: actionName }),
    {},
  ) as FormActions;
};
