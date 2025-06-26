import type { ExtendedChain } from '@lifi/sdk'
import type { Account } from '@lifi/wallet-management'
import type { MouseEventHandler, RefObject } from 'react'
import type { FormType } from '../../stores/form/types.js'
import type { TokenAmount } from '../../types/token.js'

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
  chain?: ExtendedChain
  showCategories?: boolean
  onClick(tokenAddress: string, chainId?: number): void
}

export interface TokenListItemBaseProps {
  onClick?(tokenAddress: string, chainId?: number): void
  size: number
  start: number
}

export interface TokenListItemProps extends TokenListItemBaseProps {
  accountAddress?: string
  token: TokenAmount
  onShowTokenDetails: (tokenAddress: string, noContractAddress: boolean) => void
  chain?: ExtendedChain
  isBalanceLoading?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

export interface TokenListItemButtonProps {
  onShowTokenDetails: (tokenAddress: string, noContractAddress: boolean) => void
  onClick?: MouseEventHandler<HTMLDivElement>
  accountAddress?: string
  token: TokenAmount
  chain?: ExtendedChain
  isBalanceLoading?: boolean
}

export interface TokenListItemAvatarProps {
  token: TokenAmount
}

export interface TokenDetailsSheetBase {
  isOpen(): void
  open(address: string, noContractAddress: boolean): void
  close(): void
}
