import type { Route } from '@lifi/sdk'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import type { CardProps } from '@mui/material'
import { Box, Skeleton, Tooltip } from '@mui/material'
import { type JSX, type ReactNode, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { getPriceImpact } from '../../utils/getPriceImpact.js'
import { fitInputText } from '../../utils/input.js'
import { CardTitle } from '../Card/CardTitle.js'
import { ProgressToNextUpdate } from '../ProgressToNextUpdate.js'
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

const formType = 'to' as const

type ReceiveCardProps = CardProps & { mask?: boolean }

const ReceiveAmountCardLayout = ({
  cardProps,
  title,
  headerEnd,
  amount,
  footerStart,
  footerEnd,
}: {
  cardProps: ReceiveCardProps
  title: string
  headerEnd?: ReactNode
  amount: ReactNode
  footerStart: ReactNode
  footerEnd?: ReactNode
}): JSX.Element => (
  <AmountCard {...cardProps} formType={formType}>
    <CardHeaderRow>
      <CardTitle sx={{ padding: 0 }}>{title}</CardTitle>
      {headerEnd}
    </CardHeaderRow>
    <CardBodyRow>
      {amount}
      <TokenPillButton formType={formType} />
    </CardBodyRow>
    <CardFooterRow>
      {footerStart}
      {footerEnd}
    </CardFooterRow>
  </AmountCard>
)

const PriceImpactBadge = ({
  priceImpact,
}: {
  priceImpact: number | undefined
}): JSX.Element | null => {
  const { t } = useTranslation()
  if (priceImpact === undefined) {
    return null
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <FooterText>
        {t('format.percent', { value: priceImpact, usePlusSign: true })}
      </FooterText>
      <Tooltip title={t('tooltip.priceImpact')}>
        <InfoOutlinedIcon
          sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
        />
      </Tooltip>
    </Box>
  )
}

const useReceivePriceImpact = (
  route: Route | undefined
): number | undefined => {
  const { hiddenUI } = useWidgetConfig()
  if (!route || hiddenUI?.routeCardPriceImpact) {
    return undefined
  }
  return getPriceImpact({
    fromAmount: BigInt(route.fromAmount),
    toAmount: BigInt(route.toAmount),
    fromToken: route.fromToken,
    toToken: route.toToken,
  })
}

/**
 * The receive amount is a read-only quote derived from the best route, with a
 * fiat/token toggle and price impact in the footer. In limit mode the amount is
 * still the quote for the current limit (the limit price drives it via the
 * dedicated price card); it is never edited here, and the header shows the
 * refetch progress indicator with a "Buy" title.
 */
export const ReceiveAmountCard: React.FC<ReceiveCardProps> = (
  props
): JSX.Element => {
  const { t } = useTranslation()
  const amountRef = useRef<HTMLSpanElement>(null)
  const { inputMode, toggleInputMode } = useInputModeStore()
  const showFiat = inputMode[formType] === 'price'
  const { hiddenUI, mode } = useWidgetConfig()
  const isLimit = mode === 'limit'

  const [selectedRouteId] = useFieldValues('selectedRouteId')
  const { routes, isFetching, dataUpdatedAt, refetchTime, refetch } =
    useRoutes()
  // Reflect the route the user selected in the routes list (falling back to the
  // best route), so the buy amount matches the highlighted provider card.
  const route = routes?.find((r) => r.id === selectedRouteId) ?? routes?.[0]
  const priceImpact = useReceivePriceImpact(route)
  const showPriceImpact = !hiddenUI?.routeCardPriceImpact

  const receiveAmount = route?.toAmount
    ? formatTokenAmount(BigInt(route.toAmount), route.toToken.decimals)
    : undefined
  // Only show skeletons on the initial fetch.
  const showSkeleton = isFetching && !receiveAmount

  const fiatValue =
    receiveAmount && route?.toToken.priceUSD
      ? formatTokenPrice(receiveAmount, route.toToken.priceUSD)
      : 0
  const canToggle = !!receiveAmount && !!route?.toToken.priceUSD

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
    <ReceiveAmountCardLayout
      cardProps={props}
      title={isLimit ? t('header.buy') : t('header.receive')}
      headerEnd={
        isLimit && (isFetching || routes?.length) ? (
          <ProgressToNextUpdate
            updatedAt={dataUpdatedAt || Date.now()}
            timeToUpdate={refetchTime}
            isLoading={isFetching}
            onClick={() => refetch()}
            sx={{ padding: 0 }}
          />
        ) : undefined
      }
      amount={
        showSkeleton ? (
          <Skeleton variant="rounded" height={amountHeight} sx={{ flex: 1 }} />
        ) : (
          <AmountDisplay
            ref={amountRef}
            sx={{ color: 'text.primary', opacity: receiveAmount ? 1 : 0.5 }}
          >
            {mainDisplay}
          </AmountDisplay>
        )
      }
      footerStart={
        showSkeleton ? (
          <Skeleton
            variant="text"
            width={72}
            sx={{ fontSize: footerFontSize }}
          />
        ) : (
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
        )
      }
      footerEnd={
        showSkeleton ? (
          showPriceImpact ? (
            <Skeleton
              variant="text"
              width={56}
              sx={{ fontSize: footerFontSize }}
            />
          ) : null
        ) : (
          <PriceImpactBadge priceImpact={priceImpact} />
        )
      }
    />
  )
}
