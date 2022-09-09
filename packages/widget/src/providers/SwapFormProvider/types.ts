export enum SwapFormKey {
  FromAmount = 'fromAmount',
  FromChain = 'fromChain',
  FromToken = 'fromToken',
  TokenSearchFilter = 'tokenSearchFilter',
  ToChain = 'toChain',
  ToToken = 'toToken',
  ToAddress = 'toAddress',
}

export type SwapFormValues = {
  [SwapFormKey.FromAmount]: string;
  [SwapFormKey.FromChain]: number;
  [SwapFormKey.FromToken]: string;
  [SwapFormKey.TokenSearchFilter]: string;
  [SwapFormKey.ToChain]: number;
  [SwapFormKey.ToToken]: string;
  [SwapFormKey.ToAddress]: string;
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
