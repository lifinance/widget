import { createWithEqualityFn } from 'zustand/traditional';

import type {
  DefaultValues,
  FormFieldNames,
  GenericFormValue,
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
  value: GenericFormValue,
): FormValueControl<GenericFormValue> => ({
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

const isString = (str: any) => typeof str === 'string' || str instanceof String;

const getUpdatedTouchedFields = (userValues: FormValues) => {
  return Object.keys(userValues).reduce(
    (accum, key) =>
      userValues[key as FormFieldNames]?.isTouched
        ? { ...accum, [key]: true }
        : accum,
    {},
  );
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

export const createFormStore = () =>
  createWithEqualityFn<FormValuesState>(
    (set, get) => ({
      defaultValues: valuesToFormValues(formDefaultValues),
      userValues: valuesToFormValues(formDefaultValues),
      touchedFields: {},
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
      isTouched: (fieldName: FormFieldNames) =>
        !!get().userValues[fieldName]?.isTouched,
      setAsTouched: (fieldName: FormFieldNames) => {
        const userValues = {
          ...get().userValues,
          [fieldName]: {
            ...get().userValues[fieldName],
            isTouched: true,
          },
        };

        const touchedFields = getUpdatedTouchedFields(userValues);

        set(() => ({
          userValues,
          touchedFields,
        }));
      },
      resetField: (fieldName, { defaultValue } = {}) => {
        if (defaultValue) {
          const fieldValues = {
            ...get().defaultValues[fieldName],
            value: defaultValue,
          };
          const defaultValues = {
            ...get().defaultValues,
            [fieldName]: { ...fieldValues },
          };
          const userValues = {
            ...get().userValues,
            [fieldName]: { ...fieldValues },
          };
          const touchedFields = getUpdatedTouchedFields(userValues);

          set(() => {
            return {
              defaultValues,
              userValues,
              touchedFields,
            };
          });
        } else {
          const userValues = {
            ...get().userValues,
            [fieldName]: { ...get().defaultValues[fieldName] },
          };
          const touchedFields = getUpdatedTouchedFields(userValues);

          set(() => ({
            userValues,
            touchedFields,
          }));
        }
      },
      setFieldValue: (fieldName, value, { isDirty, isTouched } = {}) => {
        const userValues = {
          ...get().userValues,
          [fieldName]: {
            value,
            isDirty:
              isDirty === undefined
                ? get().userValues[fieldName]?.isDirty
                : isDirty,
            isTouched:
              isTouched === undefined
                ? get().userValues[fieldName]?.isTouched
                : isTouched,
          },
        };

        const touchedFields = getUpdatedTouchedFields(userValues);

        set(() => ({
          userValues,
          touchedFields,
        }));
      },
      getFieldValues: (...names) =>
        names.map((name) => get().userValues[name]?.value),
      isValid: true,
      isValidating: false,
      errors: {},
      validation: {},
      addFieldValidation: (name, validationFn) => {
        set((state) => ({
          validation: {
            ...state.validation,
            [name]: validationFn,
          },
        }));
      },
      triggerFieldValidation: async (name) => {
        try {
          let valid = true;
          set(() => ({ isValid: false, isValidating: true }));

          const validationFn = get().validation[name];

          if (validationFn) {
            const result = await validationFn(get().userValues?.[name]?.value);
            if (isString(result)) {
              valid = false;
              set((state) => ({
                errors: {
                  ...state.errors,
                  [name]: result,
                },
              }));
            } else {
              valid = result as boolean;
              if (valid) {
                get().clearErrors(name);
              }
            }
          }

          set(() => ({ isValid: valid, isValidating: false }));
          return valid;
        } catch (err) {
          set(() => ({ isValidating: false }));
          throw err;
        }
      },
      clearErrors: (name) => {
        const newErrors = { ...get().errors };

        delete newErrors[name];

        set(() => ({
          errors: newErrors,
        }));
      },
    }),
    Object.is,
  );
