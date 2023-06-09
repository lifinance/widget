import type { ExtendedChain } from '@lifi/sdk';
import type { MutableRefObject } from 'react';
import type { FormType } from '../../providers';
import type { TokenAmount } from '../../types';

export interface TokenListProps {
  formType: FormType;
  height: number;
  onClick?(): void;
}

export interface VirtualizedTokenListProps {
  tokens: TokenAmount[];
  featuredTokensLength?: number;
  scrollElementRef: MutableRefObject<HTMLElement | null>;
  isLoading: boolean;
  isBalanceLoading: boolean;
  chainId: number;
  chain?: ExtendedChain;
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
  chain?: ExtendedChain;
  isBalanceLoading?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export interface TokenListItemButtonProps {
  onClick?(): void;
  showBalance?: boolean;
  token: TokenAmount;
  chain?: ExtendedChain;
  isBalanceLoading?: boolean;
}
