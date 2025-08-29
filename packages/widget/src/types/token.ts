import type {
  TokenAmount as SDKTokenAmount,
  TokenAmountExtended as SDKTokenAmountExtended,
} from '@lifi/sdk'

interface TokenFlags {
  featured?: boolean
  popular?: boolean
}

export interface TokenAmount extends SDKTokenAmount, TokenFlags {}

export interface TokenAmountExtended
  extends SDKTokenAmountExtended,
    TokenFlags {}
