export enum SwapFormKey {
  FromAmount = 'fromAmount',
  FromChain = 'fromChain',
  FromToken = 'fromToken',
  SearchTokensFilter = 'searchTokensFilter',
  ToChain = 'toChain',
  ToToken = 'toToken',
}

export type SwapFormValues = {
  [SwapFormKey.FromAmount]: string;
  [SwapFormKey.FromChain]: number;
  [SwapFormKey.FromToken]: string;
  [SwapFormKey.SearchTokensFilter]: string;
  [SwapFormKey.ToChain]: number;
  [SwapFormKey.ToToken]: string;
};

export type SwapFormDirection = 'from' | 'to';

export const SwapFormKeyHelper = {
  getChainKey: (formType: SwapFormDirection): 'fromChain' | 'toChain' =>
    `${formType}Chain`,
  getTokenKey: (formType: SwapFormDirection): 'fromToken' | 'toToken' =>
    `${formType}Token`,
  getAmountKey: (formType: SwapFormDirection): 'fromAmount' | 'toAmount' =>
    `${formType}Amount`,
};

export interface SwapFormTypeProps {
  formType: SwapFormDirection;
}
