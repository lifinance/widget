import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import type { CardProps } from '@mui/material'
import { Skeleton } from '@mui/material'
import { type ChangeEvent, type JSX, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLimitMarketRate } from '../../hooks/useLimitMarketRate.js'
import { useLinkedLimitFields } from '../../hooks/useLinkedLimitFields.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToken } from '../../hooks/useToken.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { formatInputAmount } from '../../utils/format.js'
import { applyPriceOffset, invertPrice } from '../../utils/limitOrder.js'
import {
  AmountCard,
  amountHeight,
  CardBodyRow,
  CardHeaderRow,
  LargeInput,
} from '../AmountInputCard/AmountInputCard.style.js'
import { CardTitle } from '../Card/CardTitle.js'
import { InvertChip } from './LimitPriceCard.style.js'
import { LimitPricePresets } from './LimitPricePresets.js'

const cleanDisplay = (value: string): string =>
  value ? formatInputAmount(value, 8) : ''

export const LimitPriceCard: React.FC<CardProps> = (props): JSX.Element => {
  const { t } = useTranslation()
  const isEditingRef = useRef(false)
  const [inputValue, setInputValue] = useState('')

  const [
    fromChainId,
    fromTokenAddress,
    toChainId,
    toTokenAddress,
    priceInverted,
  ] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from'),
    FormKeyHelper.getChainKey('to'),
    FormKeyHelper.getTokenKey('to'),
    'priceInverted'
  )
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress)
  const { token: toToken } = useToken(toChainId, toTokenAddress)

  const { isFetching } = useRoutes()

  // limitPrice is derived from the from/to amount fields, not stored.
  const { limitPrice, setLimitPrice } = useLinkedLimitFields()
  const { setFieldValue } = useFieldActions()

  const hasTokens = Boolean(fromToken && toToken)
  const showSkeleton = isFetching && !limitPrice
  const leadToken = priceInverted ? toToken : fromToken
  const unitToken = priceInverted ? fromToken : toToken

  const marketCanonical = useLimitMarketRate()

  // Canonical price is orientation-independent; flip only for display.
  const displayPrice = priceInverted ? invertPrice(limitPrice) : limitPrice

  // biome-ignore lint/correctness/useExhaustiveDependencies: pair fields are intentional re-run triggers, not read in the body
  useEffect(() => {
    setFieldValue('toAmount', '', { isDirty: false, isTouched: false })
    setFieldValue('selectedRouteId', undefined)
  }, [fromChainId, fromTokenAddress, toChainId, toTokenAddress])

  // Keep the input in sync with derived/preset/invert updates, but never yank
  // the value out from under an actively-typing user.
  useEffect(() => {
    if (!isEditingRef.current) {
      setInputValue(cleanDisplay(displayPrice))
    }
  }, [displayPrice])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    isEditingRef.current = true
    const formatted = formatInputAmount(event.target.value, 18, true)
    setInputValue(formatted)
    const numeric = Number(formatted)
    if (!formatted || Number.isNaN(numeric) || numeric <= 0) {
      setLimitPrice('')
      return
    }
    // Canonical price is orientation-independent; un-flip the displayed value.
    const canonical = priceInverted ? 1 / numeric : numeric
    setLimitPrice(String(canonical))
  }

  const handleBlur = (): void => {
    isEditingRef.current = false
    setInputValue(cleanDisplay(displayPrice))
  }

  const handleInvert = (): void => {
    isEditingRef.current = false
    setFieldValue('priceInverted', !priceInverted)
  }

  // Apply a percentage offset to the canonical market rate (0 = at market).
  const handlePreset = (pct: number): void => {
    if (marketCanonical === undefined) {
      return
    }
    isEditingRef.current = false
    setLimitPrice(applyPriceOffset(String(marketCanonical), pct))
  }

  const label = hasTokens
    ? t('limitOrder.priceLabel', { symbol: leadToken?.symbol })
    : t('limitOrder.price')

  return (
    <AmountCard {...props} mask={false}>
      <CardHeaderRow>
        <CardTitle sx={{ padding: 0 }}>{label}</CardTitle>
        {hasTokens ? (
          <InvertChip onClick={handleInvert} aria-label="invert price">
            {unitToken?.symbol}
            <SwapHorizIcon sx={{ fontSize: 16 }} />
          </InvertChip>
        ) : null}
      </CardHeaderRow>
      <CardBodyRow>
        {showSkeleton ? (
          <Skeleton variant="rounded" height={amountHeight} sx={{ flex: 1 }} />
        ) : (
          <LargeInput
            size="small"
            autoComplete="off"
            placeholder="0"
            inputProps={{ inputMode: 'decimal' }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={inputValue}
            name="limitPrice"
            disabled={!hasTokens}
          />
        )}
      </CardBodyRow>
      <LimitPricePresets
        onSelect={handlePreset}
        disabled={!hasTokens || marketCanonical === undefined}
      />
    </AmountCard>
  )
}
