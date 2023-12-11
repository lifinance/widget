import { createWithEqualityFn } from 'zustand/traditional';

import {
  DefaultValues,
  FormFieldNames,
  FormStoreStore,
  GenericFormValue,
  FormValueControl,
  FormValues,
  FormValuesState,
  TouchedFields,
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

const getUpdatedTouchedFields = (
  fieldName: FormFieldNames,
  userValues: FormValues,
  previousTouchedFields: TouchedFields,
) => {
  const isFieldInTouchedFields = previousTouchedFields[fieldName];
  return !isFieldInTouchedFields
    ? Object.keys(userValues).reduce(
        (accum, key) =>
          userValues[key as FormFieldNames]?.isTouched
            ? { ...accum, [key]: true }
            : accum,
        {},
      )
    : previousTouchedFields;
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

// TODO: isValidating & isValid
export const createFormStore = () => {
  const useFormStore: FormStoreStore = createWithEqualityFn<FormValuesState>(
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

        const touchedFields = getUpdatedTouchedFields(
          fieldName,
          userValues,
          get().touchedFields,
        );

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
          const touchedFields = getUpdatedTouchedFields(
            fieldName,
            userValues,
            get().touchedFields,
          );

          set((state) => {
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
          const touchedFields = getUpdatedTouchedFields(
            fieldName,
            userValues,
            get().touchedFields,
          );

          set((state) => ({
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

        const touchedFields = getUpdatedTouchedFields(
          fieldName,
          userValues,
          get().touchedFields,
        );

        set(() => ({
          userValues,
          touchedFields,
        }));
      },
      getFieldValues: (...names) =>
        names.map((name) => get().userValues[name]?.value),
    }),
    Object.is,
  );

  return useFormStore;
};
