import { Order } from '@lifinance/sdk';

export enum SwapFormKey {
  BridgePrioritization = 'bridgePrioritization',
  EnabledBridges = 'enabledBridges',
  EnabledExchanges = 'enabledExchanges',
  FromAmount = 'fromAmount',
  FromChain = 'fromChain',
  FromToken = 'fromToken',
  GasPrice = 'gasPrice',
  IsAddressConfirmed = 'isAddressConfirmed',
  IsSendToRecipient = 'isSendToRecipient',
  RecipientsAddress = 'recipientsAddress',
  RoutePriority = 'routePriority',
  SearchTokensFilter = 'searchTokensFilter',
  Slippage = 'slippage',
  ToChain = 'toChain',
  ToToken = 'toToken',
}

export type SwapFormValues = {
  [SwapFormKey.BridgePrioritization]: string;
  [SwapFormKey.EnabledBridges]: string[];
  [SwapFormKey.EnabledExchanges]: string[];
  [SwapFormKey.FromAmount]: string;
  [SwapFormKey.FromChain]: number;
  [SwapFormKey.FromToken]: string;
  [SwapFormKey.GasPrice]: string;
  [SwapFormKey.IsAddressConfirmed]: boolean;
  [SwapFormKey.IsSendToRecipient]: boolean;
  [SwapFormKey.RecipientsAddress]: string;
  [SwapFormKey.RoutePriority]: Order;
  [SwapFormKey.SearchTokensFilter]: string;
  [SwapFormKey.Slippage]: string;
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
  getSearchTokensFilterKey: (formType: SwapFormDirection) =>
    `${formType}SearchTokensFilter`,
};

export interface SwapFormTypeProps {
  formType: SwapFormDirection;
}
