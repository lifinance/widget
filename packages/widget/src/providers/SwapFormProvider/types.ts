export enum SwapFormKey {
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

export type SwapFormValues = {
  [SwapFormKey.ContractOutputsToken]: string;
  [SwapFormKey.FromAmount]: string;
  [SwapFormKey.FromChain]: number;
  [SwapFormKey.FromToken]: string;
  [SwapFormKey.ToAddress]: string;
  [SwapFormKey.ToAmount]: string;
  [SwapFormKey.ToChain]: number;
  [SwapFormKey.ToContractAddress]: string;
  [SwapFormKey.ToContractCallData]: string;
  [SwapFormKey.ToContractGasLimit]: string;
  [SwapFormKey.ToToken]: string;
  [SwapFormKey.TokenSearchFilter]: string;
};

export type SwapFormType = 'from' | 'to';

export const SwapFormKeyHelper = {
  getChainKey: (formType: SwapFormType): 'fromChain' | 'toChain' =>
    `${formType}Chain`,
  getTokenKey: (formType: SwapFormType): 'fromToken' | 'toToken' =>
    `${formType}Token`,
  getAmountKey: (formType: SwapFormType): 'fromAmount' | 'toAmount' =>
    `${formType}Amount`,
};

export interface SwapFormTypeProps {
  formType: SwapFormType;
}
