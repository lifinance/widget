import type {
  TokenAmount as SDKTokenAmount,
  TokenExtended as SDKTokenExtended,
} from '@lifi/sdk'

export interface TokenAmount extends SDKTokenAmount {
  featured?: boolean
  popular?: boolean
}
export interface TokenAmountExtended extends SDKTokenExtended, TokenAmount {}
