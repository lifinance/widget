import { UseBoundStoreWithEqualityFn } from 'zustand/esm/traditional';
import { StoreApi } from 'zustand/esm';

export interface DefaultValues {
  toAddress: string;
  tokenSearchFilter: string;
  contractOutputsToken: string;
  toContractAddress: string;
  toContractCallData: string;
  toContractGasLimit: string;
  toAmount: string;
  fromAmount: string;
  toChain?: number;
  fromChain?: number;
  fromToken?: string;
  toToken?: string | undefined;
}

export type GenericFormValue = string | number | undefined;
export interface FormValueControl<T> {
  isTouched: boolean;
  isDirty: boolean;
  value: T;
}

export interface FormValues {
  toAddress: FormValueControl<string>;
  tokenSearchFilter: FormValueControl<string>;
  contractOutputsToken: FormValueControl<string>;
  toContractAddress: FormValueControl<string>;
  toContractCallData: FormValueControl<string>;
  toContractGasLimit: FormValueControl<string>;
  toAmount: FormValueControl<string>;
  fromAmount: FormValueControl<string>;
  fromToken?: FormValueControl<string | undefined>;
  toToken?: FormValueControl<string | undefined>;
  toChain?: FormValueControl<number | undefined>;
  fromChain?: FormValueControl<number | undefined>;
}

export type FormFieldNames = keyof FormValues;

export type TouchedFields = { [key in FormFieldNames]?: boolean };
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
  getFieldValues: (...names: FormFieldNames[]) => Array<any>;
}

export type FormActionsNames = keyof FormActions;
export type FormActionsFunctions = Array<FormActions[FormActionsNames]>;

export type FormValuesState = FormProps & FormActions;

export type FormStoreStore = UseBoundStoreWithEqualityFn<
  StoreApi<FormValuesState>
>;

interface SetOptions {
  isDirty?: boolean;
  isTouched?: boolean;
}
