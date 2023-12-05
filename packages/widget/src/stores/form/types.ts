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

export type FormValue = string | number | undefined;
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
  toChain?: FormValueControl<number | undefined>;
  fromChain?: FormValueControl<number | undefined>;
  fromToken?: FormValueControl<string | undefined>;
  toToken?: FormValueControl<string | undefined>;
}

export type FormFieldNames = keyof FormValues;

export interface FormProps {
  defaultValues: FormValues;
  userValues: FormValues;
}

interface resetOptions {
  defaultValue: FormValue;
}
export interface FormValuesState extends FormProps {
  setDefaultValues: (formValues: DefaultValues) => void;
  isTouched: (fieldName: FormFieldNames) => boolean;
  resetField: (fieldName: FormFieldNames, resetOptions?: resetOptions) => void;
  setFieldValue: (fieldName: FormFieldNames, value: FormValue) => void;
}
