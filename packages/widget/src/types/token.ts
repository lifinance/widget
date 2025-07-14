import type { ExtendedChain, TokenAmount as SDKTokenAmount } from '@lifi/sdk'

export interface TokenAmount extends SDKTokenAmount {
  featured?: boolean
  popular?: boolean
}

export interface NetworkAmount
  extends Pick<
    TokenAmount,
    'symbol' | 'logoURI' | 'amount' | 'priceUSD' | 'featured' | 'popular'
  > {
  chains: ExtendedChain[]
  tokens: TokenAmount[]
}
