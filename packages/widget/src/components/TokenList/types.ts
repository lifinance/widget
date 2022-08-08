import { TokenAmount } from '@lifi/sdk';
import { MutableRefObject } from 'react';
import { SwapFormDirection } from '../../providers/SwapFormProvider';

export interface TokenListProps {
  formType: SwapFormDirection;
  height: number;
  onClick?(): void;
}

export interface VirtualizedTokenListProps {
  tokens: TokenAmount[];
  scrollElementRef: MutableRefObject<HTMLElement | null>;
  onClick(tokenAddress: string): void;
  isBalanceLoading: boolean;
  chainId: number;
  showBalance?: boolean;
}

export interface TokenListItemBaseProps {
  onClick?(tokenAddress: string): void;
  size: number;
  start: number;
}

export interface TokenListItemProps extends TokenListItemBaseProps {
  showBalance?: boolean;
  token: TokenAmount;
  isBalanceLoading?: boolean;
}
