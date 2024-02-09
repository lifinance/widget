import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export interface DefaultValues {
  contractOutputsToken: string;
  fromAmount: string;
  fromChain?: number;
  fromToken?: string;
  toAddress: string;
  toAmount: string;
  toChain?: number;
  toContractAddress: string;
  toContractCallData: string;
  toContractGasLimit: string;
  toToken?: string;
  tokenSearchFilter: string;
}

export type GenericFormValue = string | number | undefined;
export interface FormValueControl<T> {
  isTouched: boolean;
  isDirty: boolean;
  value: T;
}

export type FormValues = {
  [Property in keyof DefaultValues]: FormValueControl<DefaultValues[Property]>;
};

export type FormFieldNames = keyof FormValues;
export type ExtractValueType<T> =
  T extends FormValueControl<infer U> ? U : never;
export type FormFieldArray<T extends FormFieldNames[]> = {
  [K in keyof T]: ExtractValueType<FormValues[T[K]]>;
};

export type TouchedFields = { [key in FormFieldNames]?: boolean };

type ValidationFn = (value: any) => Promise<boolean | string>;
export interface ValidationProps {
  isValid: boolean;
  isValidating: boolean;
  errors: {
    [key in FormFieldNames]?: string;
  };
  validation: {
    [key in FormFieldNames]?: ValidationFn;
  };
}

export interface ValidationActions {
  addFieldValidation: (
    name: FormFieldNames,
    validationFn: ValidationFn,
  ) => void;
  triggerFieldValidation: (name: FormFieldNames) => Promise<boolean>;
  clearErrors: (name: FormFieldNames) => void;
}

export interface FormProps {
  defaultValues: FormValues;
  userValues: FormValues;
  touchedFields: { [key in FormFieldNames]?: boolean };
}

interface ResetOptions {
  defaultValue?: GenericFormValue;
}

export interface FormActions {
  setDefaultValues: (formValues: DefaultValues) => void;
  isTouched: (fieldName: FormFieldNames) => boolean;
  setAsTouched: (fieldName: FormFieldNames) => void;
  resetField: (fieldName: FormFieldNames, resetOptions?: ResetOptions) => void;
  setFieldValue: (
    fieldName: FormFieldNames,
    value: GenericFormValue,
    options?: SetOptions,
  ) => void;
  getFieldValues: <T extends FormFieldNames[]>(
    ...names: T
  ) => FormFieldArray<T>;
}

export type FormValuesState = FormProps &
  FormActions &
  ValidationProps &
  ValidationActions;

export type FormStoreStore = UseBoundStoreWithEqualityFn<
  StoreApi<FormValuesState>
>;

interface SetOptions {
  isDirty?: boolean;
  isTouched?: boolean;
}

export type FormType = 'from' | 'to';

export interface FormTypeProps {
  formType: FormType;
}

export const FormKeyHelper = {
  getChainKey: (formType: FormType): 'fromChain' | 'toChain' =>
    `${formType}Chain`,
  getTokenKey: (formType: FormType): 'fromToken' | 'toToken' =>
    `${formType}Token`,
  getAmountKey: (formType: FormType): 'fromAmount' | 'toAmount' =>
    `${formType}Amount`,
};
