import type { ExtendedChain } from '@lifi/sdk'
import type { RefObject } from 'react'
import type { FormType } from '../../stores/form/types.js'
import type { TokenAmount } from '../../types/token.js'

export interface TokenListProps {
  parentRef: RefObject<HTMLElement | null>
  formType: FormType
  height: number
  onClick?(): void
}

export interface VirtualizedTokenListProps {
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

interface TokenListItemBaseProps {
  onClick?(tokenAddress: string, chainId?: number): void
  size: number
  start: number
}

export interface TokenListItemProps extends TokenListItemBaseProps {
  token: TokenAmount
  onShowTokenDetails: (
    tokenAddress: string,
    noContractAddress: boolean,
    chainId: number
  ) => void
  chain?: ExtendedChain
  isBalanceLoading?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  selected?: boolean
}

export interface TokenListItemButtonProps {
  onShowTokenDetails: (
    tokenAddress: string,
    noContractAddress: boolean,
    chainId: number
  ) => void
  onClick?(tokenAddress: string, chainId?: number): void
  token: TokenAmount
  chain?: ExtendedChain
  isBalanceLoading?: boolean
  selected?: boolean
}

export interface TokenListItemAvatarProps {
  token: TokenAmount
}

export interface TokenDetailsSheetBase {
  isOpen(): void
  open(address: string, noContractAddress: boolean, chainId: number): void
  close(): void
}
