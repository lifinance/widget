export enum SwapFormKey {
  FromAmount = 'fromAmount',
  FromChain = 'fromChain',
  FromToken = 'fromToken',
  ToAddress = 'toAddress',
  ToChain = 'toChain',
  ToToken = 'toToken',
  TokenSearchFilter = 'tokenSearchFilter',
}

export type SwapFormValues = {
  [SwapFormKey.FromAmount]: string;
  [SwapFormKey.FromChain]: number;
  [SwapFormKey.FromToken]: string;
  [SwapFormKey.ToAddress]: string;
  [SwapFormKey.ToChain]: number;
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
