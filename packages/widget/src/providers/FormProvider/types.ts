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

export type FormValues = {
  [FormKey.ContractOutputsToken]: string;
  [FormKey.FromAmount]: string;
  [FormKey.FromChain]: number;
  [FormKey.FromToken]: string;
  [FormKey.ToAddress]: string;
  [FormKey.ToAmount]: string;
  [FormKey.ToChain]: number;
  [FormKey.ToContractAddress]: string;
  [FormKey.ToContractCallData]: string;
  [FormKey.ToContractGasLimit]: string;
  [FormKey.ToToken]: string;
  [FormKey.TokenSearchFilter]: string;
};

export type FormType = 'from' | 'to';

export const FormKeyHelper = {
  getChainKey: (formType: FormType): 'fromChain' | 'toChain' =>
    `${formType}Chain`,
  getTokenKey: (formType: FormType): 'fromToken' | 'toToken' =>
    `${formType}Token`,
  getAmountKey: (formType: FormType): 'fromAmount' | 'toAmount' =>
    `${formType}Amount`,
};

export interface FormTypeProps {
  formType: FormType;
}
