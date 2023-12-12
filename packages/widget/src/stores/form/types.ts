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
  getFieldValues: (...names: FormFieldNames[]) => Array<any>;
}

export type FormActionsNames = keyof FormActions;
export type FormActionsFunctions = Array<FormActions[FormActionsNames]>;

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

export enum FormKey {
  ContractOutputsToken = 'contractOutputsToken',
  FromAmount = 'fromAmount',
  FromChain = 'fromChain',
  FromToken = 'fromToken',
  ToAddress = 'toAddress',
  ToAmount = 'toAmount',
  ToChain = 'toChain',
  ToContractAddress = 'toContractAddress',
  ToContractCallData = 'toContractCallData',
  ToContractGasLimit = 'ToContractGasLimit',
  ToToken = 'toToken',
  TokenSearchFilter = 'tokenSearchFilter',
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
