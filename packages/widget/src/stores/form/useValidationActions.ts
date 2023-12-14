import type { ValidationActions } from './types';
import { useFormStore } from './FormStore';
import { shallow } from 'zustand/shallow';
import type { ValidationActionFunctions, ValidationActionNames } from './types';

const validationFunctions: ValidationActionNames[] = [
  'addFieldValidation',
  'triggerFieldValidation',
  'clearErrors',
];
export const useValidationActions = () => {
  const actions: ValidationActionFunctions = useFormStore(
    (store) => validationFunctions.map((actionName) => store[actionName]),
    shallow,
  );

  return actions.reduce(
    (accum, actionName, i) => ({
      ...accum,
      [validationFunctions[i]]: actionName,
    }),
    {},
  ) as ValidationActions;
};
