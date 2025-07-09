import type { ExtendedChain, TokenAmount as SDKTokenAmount } from '@lifi/sdk'

export interface TokenAmount extends SDKTokenAmount {
  featured?: boolean
  popular?: boolean
}

export interface NetworkAmount extends Omit<TokenAmount, 'chainId'> {
  chains?: ExtendedChain[]
  tokens?: TokenAmount[]
}
