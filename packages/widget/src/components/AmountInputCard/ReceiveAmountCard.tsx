import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import type { CardProps } from '@mui/material'
import { Box, Skeleton, Tooltip } from '@mui/material'
import { type JSX, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { getPriceImpact } from '../../utils/getPriceImpact.js'
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
  footerFontSize,
  maxInputFontSize,
  minInputFontSize,
  ToggleButton,
} from './AmountInputCard.style.js'

export const ReceiveAmountCard: React.FC<CardProps & { mask?: boolean }> = (
  props
): JSX.Element => {
  const { t } = useTranslation()
  const amountRef = useRef<HTMLSpanElement>(null)
  const formType = 'to' as const
  const { inputMode, toggleInputMode } = useInputModeStore()
  const showFiat = inputMode[formType] === 'price'
  const { hiddenUI } = useWidgetConfig()
  const { routes, isFetching } = useRoutes()

  const route = routes?.[0]
  const receiveAmount = route?.toAmount
    ? formatTokenAmount(BigInt(route.toAmount), route.toToken.decimals)
    : undefined

  // Only show skeletons on the initial fetch
  const showSkeleton = isFetching && !receiveAmount

  const fiatValue =
    receiveAmount && route?.toToken.priceUSD
      ? formatTokenPrice(receiveAmount, route.toToken.priceUSD)
      : 0

  const canToggle = !!receiveAmount && !!route?.toToken.priceUSD

  const showPriceImpact = !hiddenUI?.routeCardPriceImpact

  const priceImpact =
    route && showPriceImpact
      ? getPriceImpact({
          fromAmount: BigInt(route.fromAmount),
          toAmount: BigInt(route.toAmount),
          fromToken: route.fromToken,
          toToken: route.toToken,
        })
      : undefined

  const mainDisplay = showFiat
    ? t('format.currency', { value: fiatValue })
    : t('format.tokenAmount', { value: receiveAmount || '0' })

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
        {showSkeleton ? (
          <Skeleton variant="rounded" height={amountHeight} sx={{ flex: 1 }} />
        ) : (
          <AmountDisplay
            ref={amountRef}
            sx={{
              color: 'text.primary',
              opacity: receiveAmount ? 1 : 0.5,
            }}
          >
            {mainDisplay}
          </AmountDisplay>
        )}
        <TokenPillButton formType={formType} />
      </CardBodyRow>
      <CardFooterRow>
        {showSkeleton ? (
          <>
            <Skeleton
              variant="text"
              width={72}
              sx={{ fontSize: footerFontSize }}
            />
            {showPriceImpact ? (
              <Skeleton
                variant="text"
                width={56}
                sx={{ fontSize: footerFontSize }}
              />
            ) : null}
          </>
        ) : (
          <>
            <ToggleButton
              clickable={canToggle}
              onClick={canToggle ? () => toggleInputMode(formType) : undefined}
              aria-label={canToggle ? 'Toggle fiat value' : undefined}
            >
              <FooterText>{footerDisplay}</FooterText>
              {canToggle ? (
                <SwapVertIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              ) : null}
            </ToggleButton>
            {priceImpact !== undefined ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FooterText>
                  {t('format.percent', {
                    value: priceImpact,
                    usePlusSign: true,
                  })}
                </FooterText>
                <Tooltip title={t('tooltip.priceImpact')}>
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: 16,
                      color: 'text.secondary',
                      cursor: 'help',
                    }}
                  />
                </Tooltip>
              </Box>
            ) : null}
          </>
        )}
      </CardFooterRow>
    </AmountCard>
  )
}
