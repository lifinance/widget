import type { ExtendedChain } from '@lifi/sdk'
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
  chain?: ExtendedChain
  onShowTokenDetails: (tokenAddress: string, noContractAddress: boolean) => void
}

export interface TokenListItemButtonProps {
  onShowTokenDetails: (tokenAddress: string, noContractAddress: boolean) => void
  onClick?(tokenAddress: string, chainId?: number): void
  accountAddress?: string
  token: TokenAmount
  isBalanceLoading?: boolean
  selected?: boolean
  chain?: ExtendedChain
}

export interface TokenListItemAvatarProps {
  token: TokenAmount
}

export interface TokenDetailsSheetBase {
  isOpen(): void
  open(address: string, noContractAddress: boolean): void
  close(): void
}
