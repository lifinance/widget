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
  tokens: TokenAmount[]
  scrollElementRef: RefObject<HTMLElement | null>
  isLoading: boolean
  isBalanceLoading: boolean
  chainId?: number
  showCategories?: boolean
  onClick(tokenAddress: string, chainId?: number): void
  selectedTokenAddress?: string
  isAllNetworks: boolean
}

export interface TokenListItemBaseProps {
  onClick?(tokenAddress: string, chainId?: number): void
  size: number
  start: number
}

export interface TokenListItemProps extends TokenListItemBaseProps {
  showBalance: boolean
  token: TokenAmount | NetworkAmount
  isExpanded: boolean
  onExpand: (expanded: boolean) => void
  onShowTokenDetails: (tokenAddress: string, noContractAddress: boolean) => void
  chain?: ExtendedChain
  isBalanceLoading?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  selectedTokenAddress?: string
}

export interface TokenListItemButtonProps {
  onShowTokenDetails: (tokenAddress: string, noContractAddress: boolean) => void
  onClick?(tokenAddress: string, chainId?: number): void
  showBalance: boolean
  token: TokenAmount
  chain?: ExtendedChain
  isBalanceLoading?: boolean
  selected?: boolean
}

export interface TokenDetailsSheetBase {
  isOpen(): void
  open(address: string, noContractAddress: boolean): void
  close(): void
}
