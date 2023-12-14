import { shallow } from 'zustand/shallow';
import type {
  FormActions,
  FormActionNames,
  FormActionFunctions,
} from './types';
import { useFormStore } from './FormStore';

const actionFunctions: FormActionNames[] = [
  'setDefaultValues',
  'isTouched',
  'setAsTouched',
  'resetField',
  'setFieldValue',
  'getFieldValues',
];

export const useFieldActions = () => {
  const actions: FormActionFunctions = useFormStore(
    (store) => actionFunctions.map((actionName) => store[actionName]),
    shallow,
  );

  return actions.reduce(
    (accum, actionName, i) => ({ ...accum, [actionFunctions[i]]: actionName }),
    {},
  ) as FormActions;
};
