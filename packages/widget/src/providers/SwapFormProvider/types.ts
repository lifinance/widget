import { ChainKey } from '@lifinance/sdk';

export type SwapFormValues = {
  fromAmount: number;
  fromChain: ChainKey;
  fromToken: string;
  toChain: ChainKey;
  toToken: string;
};

export enum SwapFormKey {
  FromAmount = 'fromAmount',
  FromChain = 'fromChain',
  FromSearchTokensFilter = 'fromSearchTokensFilter',
  FromToken = 'fromToken',
  IsAddressConfirmed = 'isAddressConfirmed',
  IsSendToRecipient = 'isSendToRecipient',
  MyTokensFilter = 'myTokensFilter',
  RecipientsAddress = 'recipientsAddress',
  RoutePriority = 'routePriority',
  ToAmount = 'toAmount',
  ToChain = 'toChain',
  ToSearchTokensFilter = 'toSearchTokensFilter',
  ToToken = 'toToken',
}

export type SwapFormDirection = 'from' | 'to';

export const SwapFormKeyHelper = {
  getChainKey: (type: SwapFormDirection) => `${type}Chain`,
  getTokenKey: (type: SwapFormDirection) => `${type}Token`,
  getSearchTokensFilterKey: (type: SwapFormDirection) =>
    `${type}SearchTokensFilter`,
};
