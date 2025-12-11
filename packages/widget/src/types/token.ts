import type {
  TokenAmount as SDKTokenAmount,
  TokenAmountExtended as SDKTokenAmountExtended,
  TokenExtended,
} from '@lifi/sdk'

interface TokenFlags {
  featured?: boolean
  popular?: boolean
  verified?: boolean
}

export interface TokenAmount extends SDKTokenAmount, TokenFlags {}

export interface TokenAmountExtended
  extends SDKTokenAmountExtended,
    TokenFlags {}

export type TokenWithVerified = TokenExtended & { verified?: boolean }
export type TokensByChain = Record<number, TokenWithVerified[]>
