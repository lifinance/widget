import type { TokenAmount } from '@lifi/sdk'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { getPriceImpact } from '../../utils/getPriceImpact.js'
import { TextSecondary } from './Token.style.js'

interface PriceImpactLabelProps {
  token: TokenAmount
  impactToken: TokenAmount
}

export const PriceImpactLabel: FC<PriceImpactLabelProps> = ({
  token,
  impactToken,
}) => {
  const { t, i18n } = useTranslation()

  const priceImpact = getPriceImpact({
    fromToken: impactToken,
    fromAmount: impactToken.amount,
    toToken: token,
    toAmount: token.amount,
  })

  const formatted = t('format.percent', {
    value: priceImpact,
    usePlusSign: true,
  })

  return (
    <>
      <TextSecondary px={0.5} dot>
        &#x2022;
      </TextSecondary>
      <TextSecondary
        title={(priceImpact * 100).toLocaleString(i18n.language, {
          maximumFractionDigits: 9,
        })}
      >
        {formatted}
      </TextSecondary>
    </>
  )
}
