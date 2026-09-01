import type {
  TokenAmount as SDKTokenAmount,
  TokenAmountExtended as SDKTokenAmountExtended,
  TokenExtended,
} from '@lifi/sdk'

export interface TokenFlags {
  featured?: boolean
  popular?: boolean
  pinned?: boolean
  verified?: boolean
  native?: boolean
  /** Came from the main token list rather than from a search. */
  listed?: boolean
}

export interface TokenAmount extends SDKTokenAmount, TokenFlags {}

export interface TokenAmountExtended
  extends SDKTokenAmountExtended,
    TokenFlags {}

export type TokenWithFlags = TokenExtended & TokenFlags
export type TokensByChain = Record<number, TokenWithFlags[]>
