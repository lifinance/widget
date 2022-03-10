export enum SwapFormKey {
  BridgePrioritization = 'bridgePrioritization',
  EnabledBridges = 'enabledBridges',
  EnabledExchanges = 'enabledExchanges',
  FromAmount = 'fromAmount',
  FromChain = 'fromChain',
  FromSearchTokensFilter = 'fromSearchTokensFilter',
  FromToken = 'fromToken',
  GasPrice = 'gasPrice',
  IsAddressConfirmed = 'isAddressConfirmed',
  IsSendToRecipient = 'isSendToRecipient',
  MyTokensFilter = 'myTokensFilter',
  RecipientsAddress = 'recipientsAddress',
  RoutePriority = 'routePriority',
  Slippage = 'slippage',
  ToAmount = 'toAmount',
  ToChain = 'toChain',
  ToSearchTokensFilter = 'toSearchTokensFilter',
  ToToken = 'toToken',
}

export type SwapFormValues = {
  [SwapFormKey.BridgePrioritization]: string;
  [SwapFormKey.EnabledBridges]: string[];
  [SwapFormKey.EnabledExchanges]: string[];
  [SwapFormKey.FromAmount]: string;
  [SwapFormKey.FromChain]: number;
  [SwapFormKey.FromSearchTokensFilter]: string;
  [SwapFormKey.FromToken]: string;
  [SwapFormKey.GasPrice]: string;
  [SwapFormKey.IsAddressConfirmed]: boolean;
  [SwapFormKey.IsSendToRecipient]: boolean;
  [SwapFormKey.MyTokensFilter]: number;
  [SwapFormKey.RecipientsAddress]: string;
  [SwapFormKey.RoutePriority]: string;
  [SwapFormKey.Slippage]: string;
  [SwapFormKey.ToAmount]: string;
  [SwapFormKey.ToChain]: number;
  [SwapFormKey.ToSearchTokensFilter]: string;
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
  getSearchTokensFilterKey: (formType: SwapFormDirection) =>
    `${formType}SearchTokensFilter`,
};

export interface SwapFormTypeProps {
  formType: SwapFormDirection;
}
