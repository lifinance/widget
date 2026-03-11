import type { FC } from 'react'
import { TextSecondary } from './Token.style.js'

interface TokenSymbolLabelProps {
  symbol: string
}

export const TokenSymbolLabel: FC<TokenSymbolLabelProps> = ({ symbol }) => {
  return (
    <>
      <TextSecondary px={0.5} dot>
        &#x2022;
      </TextSecondary>
      <TextSecondary>{symbol}</TextSecondary>
    </>
  )
}
