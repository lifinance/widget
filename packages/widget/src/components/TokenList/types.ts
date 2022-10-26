import type { TokenAmount } from '@lifi/sdk';
import type { MutableRefObject } from 'react';
import type { SwapFormType } from '../../providers';
import type { Token } from '../../types';

export interface TokenListProps {
  formType: SwapFormType;
  height: number;
  onClick?(): void;
}

export interface VirtualizedTokenListProps {
  tokens: Token[];
  featuredTokensLength?: number;
  scrollElementRef: MutableRefObject<HTMLElement | null>;
  isLoading: boolean;
  isBalanceLoading: boolean;
  chainId: number;
  showBalance?: boolean;
  showFeatured?: boolean;
  onClick(tokenAddress: string): void;
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
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export interface TokenListItemButtonProps {
  onClick?(): void;
  showBalance?: boolean;
  token: TokenAmount;
  isBalanceLoading?: boolean;
}
