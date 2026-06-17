import SwapVertIcon from '@mui/icons-material/SwapVert'
import type { CardProps } from '@mui/material'
import { Skeleton } from '@mui/material'
import { type JSX, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRoutes } from '../../hooks/useRoutes.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { fitInputText } from '../../utils/input.js'
import { CardTitle } from '../Card/CardTitle.js'
import { TokenPillButton } from '../TokenPillButton/TokenPillButton.js'
import {
  AmountCard,
  AmountDisplay,
  amountHeight,
  CardBodyRow,
  CardFooterRow,
  CardHeaderRow,
  FooterText,
  maxInputFontSize,
  minInputFontSize,
  ToggleButton,
} from './AmountInputCard.style.js'

export const ReceiveAmountCard: React.FC<CardProps & { mask?: boolean }> = (
  props
): JSX.Element => {
  const { t } = useTranslation()
  const amountRef = useRef<HTMLSpanElement>(null)
  const [showFiat, setShowFiat] = useState(false)
  const formType = 'to' as const
  const { routes, isFetching } = useRoutes()

  const route = routes?.[0]
  const receiveAmount =
    route && route.toAmount
      ? formatTokenAmount(BigInt(route.toAmount), route.toToken.decimals)
      : undefined

  const fiatValue =
    receiveAmount && route?.toToken.priceUSD
      ? formatTokenPrice(receiveAmount, route.toToken.priceUSD)
      : 0

  const canToggle = !!receiveAmount && !!route?.toToken.priceUSD

  const mainDisplay = showFiat
    ? t('format.currency', { value: fiatValue })
    : receiveAmount || '0'

  const footerDisplay = showFiat
    ? t('format.tokenAmount', { value: receiveAmount || '0' })
    : t('format.currency', { value: fiatValue })

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect must run on value change
  useLayoutEffect(() => {
    if (amountRef.current) {
      fitInputText(maxInputFontSize, minInputFontSize, amountRef.current)
    }
  }, [mainDisplay])

  return (
    <AmountCard {...props} formType={formType}>
      <CardHeaderRow>
        <CardTitle sx={{ padding: 0 }}>{t('header.receive')}</CardTitle>
      </CardHeaderRow>
      <CardBodyRow>
        {isFetching ? (
          <Skeleton
            variant="rounded"
            width={120}
            height={amountHeight}
            sx={{ flex: 1 }}
          />
        ) : (
          <AmountDisplay
            ref={amountRef}
            sx={{
              color: receiveAmount ? 'text.primary' : 'text.secondary',
            }}
          >
            {mainDisplay}
          </AmountDisplay>
        )}
        <TokenPillButton formType={formType} />
      </CardBodyRow>
      <CardFooterRow>
        <ToggleButton
          clickable={canToggle}
          onClick={canToggle ? () => setShowFiat((v) => !v) : undefined}
        >
          <FooterText>{footerDisplay}</FooterText>
          {canToggle ? (
            <SwapVertIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          ) : null}
        </ToggleButton>
      </CardFooterRow>
    </AmountCard>
  )
}
