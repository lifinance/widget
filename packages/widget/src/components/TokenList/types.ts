import type { ExtendedChain } from '@lifi/sdk';
import type { MouseEventHandler, MutableRefObject } from 'react';
import type { Account } from '../../hooks/useAccount.js';
import type { FormType } from '../../stores/form/types.js';
import type { TokenAmount } from '../../types/token.js';

export interface TokenListProps {
  formType: FormType;
  height: number;
  onClick?(): void;
}

export interface VirtualizedTokenListProps {
  account: Account;
  tokens: TokenAmount[];
  scrollElementRef: MutableRefObject<HTMLElement | null>;
  isLoading: boolean;
  isBalanceLoading: boolean;
  chainId?: number;
  chain?: ExtendedChain;
  showCategories?: boolean;
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
  onClick?: MouseEventHandler<HTMLDivElement>;
  showBalance?: boolean;
  token: TokenAmount;
  chain?: ExtendedChain;
  isBalanceLoading?: boolean;
}
