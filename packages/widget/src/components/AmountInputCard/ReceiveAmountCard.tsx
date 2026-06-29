import type { Route } from '@lifi/sdk'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import type { CardProps } from '@mui/material'
import { Box, Skeleton, Tooltip } from '@mui/material'
import {
  type ChangeEvent,
  type JSX,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useLinkedLimitFields } from '../../hooks/useLinkedLimitFields.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToken } from '../../hooks/useToken.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import {
  formatInputAmount,
  formatTokenAmount,
  formatTokenPrice,
  priceToTokenAmount,
  usdDecimals,
} from '../../utils/format.js'
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
  LargeInput,
  maxInputFontSize,
  minInputFontSize,
  ToggleButton,
} from './AmountInputCard.style.js'
import { FiatValueToggle } from './FiatValueToggle.js'

const formType = 'to' as const

type ReceiveCardProps = CardProps & { mask?: boolean }

/**
 * Shared presentational shell for both receive modes. The limit-order and quote
 * variants only differ in what they render into these slots — the card chrome
 * (header / body / footer rows + token pill) stays identical.
 */
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
 * Limit mode: the receive amount is user-editable and linked to the limit price
 * (editing it re-derives the price), so we render an input that mirrors the send
 * card — same fiat toggle and price impact, in either token or fiat input mode.
 */
const LimitReceiveCard = (props: ReceiveCardProps): JSX.Element => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const isEditingRef = useRef(false)
  const [formattedPriceInput, setFormattedPriceInput] = useState('')

  const { inputMode } = useInputModeStore()
  const showFiat = inputMode[formType] === 'price'

  const { routes, isFetching, dataUpdatedAt, refetchTime, refetch } =
    useRoutes()
  const priceImpact = useReceivePriceImpact(routes?.[0])

  const [toChainId, toTokenAddress, toAmount] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
    FormKeyHelper.getAmountKey(formType)
  )
  const { token: toToken } = useToken(toChainId, toTokenAddress)
  const { setReceiveAmount } = useLinkedLimitFields()

  let displayValue: string
  if (isEditingRef.current) {
    displayValue = showFiat ? formattedPriceInput : (toAmount as string)
  } else if (showFiat) {
    const priceValue = formatTokenPrice(toAmount as string, toToken?.priceUSD)
    displayValue = formatInputAmount(
      priceValue.toFixed(usdDecimals),
      usdDecimals
    )
  } else {
    displayValue = toAmount as string
  }

  // `isFinal` (blur) re-formats to the token's decimals; the live (change) path
  // keeps the raw input so typing isn't fought by reformatting mid-edit.
  const commitAmount = (rawValue: string, isFinal: boolean): void => {
    if (showFiat) {
      const cleanValue = rawValue.replace('$', '')
      const formattedPrice = formatInputAmount(
        cleanValue,
        usdDecimals,
        !isFinal
      )
      const tokenValue = priceToTokenAmount(formattedPrice, toToken?.priceUSD)
      if (isFinal) {
        setReceiveAmount(formatInputAmount(tokenValue, toToken?.decimals))
      } else {
        setFormattedPriceInput(formattedPrice)
        setReceiveAmount(tokenValue)
      }
    } else {
      setReceiveAmount(formatInputAmount(rawValue, toToken?.decimals, !isFinal))
    }
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    isEditingRef.current = true
    commitAmount(event.target.value, false)
  }

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    isEditingRef.current = false
    commitAmount(event.target.value, true)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect must run on value change
  useLayoutEffect(() => {
    if (inputRef.current) {
      fitInputText(maxInputFontSize, minInputFontSize, inputRef.current)
    }
  }, [displayValue])

  return (
    <ReceiveAmountCardLayout
      cardProps={props}
      title={t('header.buy')}
      headerEnd={
        isFetching || routes?.length ? (
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
        <LargeInput
          inputRef={inputRef}
          size="small"
          autoComplete="off"
          placeholder={showFiat ? '$0' : '0'}
          inputProps={{ inputMode: 'decimal' }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={
            showFiat ? (displayValue ? `$${displayValue}` : '') : displayValue
          }
          name="toAmount"
        />
      }
      footerStart={<FiatValueToggle formType={formType} />}
      footerEnd={<PriceImpactBadge priceImpact={priceImpact} />}
    />
  )
}

/**
 * Default (swap/bridge) mode: the receive amount is a read-only quote derived
 * from the best route, with a fiat/token toggle and price impact in the footer.
 */
const QuoteReceiveCard = (props: ReceiveCardProps): JSX.Element => {
  const { t } = useTranslation()
  const amountRef = useRef<HTMLSpanElement>(null)
  const { inputMode, toggleInputMode } = useInputModeStore()
  const showFiat = inputMode[formType] === 'price'
  const { hiddenUI } = useWidgetConfig()

  const { routes, isFetching } = useRoutes()
  const route = routes?.[0]
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
      title={t('header.receive')}
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

export const ReceiveAmountCard: React.FC<ReceiveCardProps> = (
  props
): JSX.Element => {
  const { mode } = useWidgetConfig()
  return mode === 'limit' ? (
    <LimitReceiveCard {...props} />
  ) : (
    <QuoteReceiveCard {...props} />
  )
}
