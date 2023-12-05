import { createWithEqualityFn } from 'zustand/traditional';
import {
  DefaultValues,
  FormFieldNames,
  FormValue,
  FormValueControl,
  FormValues,
  FormValuesState,
} from './types';

export const formDefaultValues: DefaultValues = {
  fromAmount: '',
  toAddress: '',
  tokenSearchFilter: '',
  contractOutputsToken: '',
  toContractAddress: '',
  toContractCallData: '',
  toContractGasLimit: '',
  toAmount: '',
};

const defaultValueToFormValue = (
  value: FormValue,
): FormValueControl<FormValue> => ({
  isTouched: false,
  isDirty: false,
  value,
});
const valuesToFormValues = (defaultValues: DefaultValues): FormValues => {
  return (Object.keys(defaultValues) as FormFieldNames[]).reduce(
    (accum, key) => {
      return { ...accum, [key]: defaultValueToFormValue(defaultValues[key]) };
    },
    {},
  ) as FormValues;
};
const mergeDefaultFormValues = (
  userValues: FormValues,
  defaultValues: FormValues,
) =>
  (Object.keys(defaultValues) as FormFieldNames[]).reduce<FormValues>(
    (accum, key) => {
      const formValue = {
        isTouched: !!(
          userValues[key]?.isTouched || defaultValues[key]?.isTouched
        ),
        isDirty: !!(userValues[key]?.isDirty || defaultValues[key]?.isTouched),
        value:
          userValues[key]?.value || Number.isFinite(userValues[key]?.value)
            ? userValues[key]?.value
            : defaultValues[key]?.value,
      };

      return {
        ...accum,
        [key]: formValue,
      };
    },
    { ...valuesToFormValues(formDefaultValues) },
  );

// TODO: supply touchedFields - see packages/widget/src/providers/FormProvider/URLSearchParamsBuilder.tsx
// TODO: isValidating & isValid
export const createFormStore = () =>
  createWithEqualityFn<FormValuesState>(
    (set, get) => ({
      defaultValues: valuesToFormValues(formDefaultValues),
      userValues: valuesToFormValues(formDefaultValues),
      setDefaultValues: (defaultValue) => {
        const defaultFormValues = valuesToFormValues(defaultValue);
        set((state) => ({
          defaultValues: defaultFormValues,
          userValues: mergeDefaultFormValues(
            state.userValues,
            defaultFormValues,
          ),
        }));
      },
      isTouched: (fieldName: FormFieldNames) => {
        return !!get().userValues[fieldName]?.isTouched;
      },
      resetField: (fieldName, resetOptions) => {
        const value = resetOptions?.defaultValue;

        if (value) {
          set((state) => {
            const fieldValues = {
              ...state.defaultValues[fieldName],
              value,
            };

            return {
              defaultValues: {
                ...state.defaultValues,
                [fieldName]: { ...fieldValues },
              },
              userValues: {
                ...state.userValues,
                [fieldName]: { ...fieldValues },
              },
            };
          });
        } else {
          set((state) => ({
            userValues: {
              ...state.userValues,
              [fieldName]: { ...state.defaultValues[fieldName] },
            },
          }));
        }
      },
      setFieldValue: (fieldName, value) => {
        set((state) => {
          return {
            userValues: {
              ...state.userValues,
              [fieldName]: {
                ...state.userValues[fieldName],
                value,
              },
            },
          };
        });
      },
      // getFieldValues: (listOfFields) => listOfValues
    }),
    Object.is,
  );
