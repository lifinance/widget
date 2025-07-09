import type { Account } from '@lifi/wallet-management'
import type { RefObject } from 'react'
import type { FormType } from '../../stores/form/types.js'
import type { NetworkAmount, TokenAmount } from '../../types/token.js'

export interface TokenListProps {
  parentRef: RefObject<HTMLElement | null>
  formType: FormType
  height: number
  onClick?(): void
}

export interface VirtualizedTokenListProps {
  account: Account
  tokens: TokenAmount[] | NetworkAmount[]
  scrollElementRef: RefObject<HTMLElement | null>
  isLoading: boolean
  isBalanceLoading: boolean
  chainId?: number
  showCategories?: boolean
  onClick(tokenAddress: string, chainId?: number): void
  selectedTokenAddress?: string
}

export interface TokenListItemBaseProps {
  onClick?(tokenAddress: string, chainId?: number): void
  size: number
  start: number
}

export interface TokenListItemProps extends TokenListItemBaseProps {
  accountAddress?: string
  token: TokenAmount | NetworkAmount
  isBalanceLoading?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  isSelected?: boolean
}

export interface TokenListItemButtonProps {
  onClick?(tokenAddress: string, chainId?: number): void
  accountAddress?: string
  token: TokenAmount
  isBalanceLoading?: boolean
  isSelected?: boolean
}

export interface TokenListItemAvatarProps {
  token: TokenAmount
}
