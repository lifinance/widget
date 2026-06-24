import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import type { CardProps } from '@mui/material'
import { type ChangeEvent, type JSX, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLimitMarketRate } from '../../hooks/useLimitMarketRate.js'
import { useLinkedLimitFields } from '../../hooks/useLinkedLimitFields.js'
import { useToken } from '../../hooks/useToken.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useLimitOrderStore } from '../../stores/limitOrder/useLimitOrderStore.js'
import { formatInputAmount } from '../../utils/format.js'
import { invertPrice } from '../../utils/limitOrder.js'
import {
  AmountCard,
  CardBodyRow,
  CardHeaderRow,
  LargeInput,
} from '../AmountInputCard/AmountInputCard.style.js'
import { ChipContainer } from '../AmountInputCard/PercentageChips.style.js'
import { CardTitle } from '../Card/CardTitle.js'
import { InvertChip, PriceChip } from './LimitPriceCard.style.js'

/** Quick-set presets, as percentage offsets from market (0 = at market). */
const PRESETS = [0, 1, 5, 10] as const

const cleanDisplay = (value: string): string =>
  value ? formatInputAmount(value, 8) : ''

export const LimitPriceCard: React.FC<CardProps> = (props): JSX.Element => {
  const { t } = useTranslation()
  const isEditingRef = useRef(false)
  const [inputValue, setInputValue] = useState('')

  const [fromChainId, fromTokenAddress, toChainId, toTokenAddress] =
    useFieldValues(
      FormKeyHelper.getChainKey('from'),
      FormKeyHelper.getTokenKey('from'),
      FormKeyHelper.getChainKey('to'),
      FormKeyHelper.getTokenKey('to')
    )
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress)
  const { token: toToken } = useToken(toChainId, toTokenAddress)

  const limitPrice = useLimitOrderStore((state) => state.limitPrice)
  const priceInverted = useLimitOrderStore((state) => state.priceInverted)
  const togglePriceDirection = useLimitOrderStore(
    (state) => state.togglePriceDirection
  )
  const setStorePrice = useLimitOrderStore((state) => state.setLimitPrice)
  const { setLimitPrice } = useLinkedLimitFields()
  const { setFieldValue } = useFieldActions()

  const hasTokens = Boolean(fromToken && toToken)
  const leadToken = priceInverted ? toToken : fromToken
  const unitToken = priceInverted ? fromToken : toToken

  const marketCanonical = useLimitMarketRate()

  // Canonical price is orientation-independent; flip only for display.
  const displayPrice = priceInverted ? invertPrice(limitPrice) : limitPrice

  // Reset the limit price and derived receive amount whenever the token pair
  // changes or limit mode is (re)entered, so a stale price from a previous pair
  // can't drive a wrong receive amount or a false off-market warning.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pair fields are intentional re-run triggers, not read in the body
  useEffect(() => {
    setStorePrice('')
    setFieldValue('toAmount', '', { isDirty: false, isTouched: false })
  }, [fromChainId, fromTokenAddress, toChainId, toTokenAddress])

  // Keep the input in sync with derived/preset/invert updates, but never yank
  // the value out from under an actively-typing user.
  useEffect(() => {
    if (!isEditingRef.current) {
      setInputValue(cleanDisplay(displayPrice))
    }
  }, [displayPrice])

  const commitDisplayedPrice = (displayed: number): void => {
    const canonical = priceInverted ? 1 / displayed : displayed
    setLimitPrice(String(canonical))
  }

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
    commitDisplayedPrice(numeric)
  }

  const handleBlur = (): void => {
    isEditingRef.current = false
    setInputValue(cleanDisplay(displayPrice))
  }

  const handleInvert = (): void => {
    isEditingRef.current = false
    togglePriceDirection()
  }

  const handlePreset = (pct: number): void => {
    if (marketCanonical === undefined) {
      return
    }
    isEditingRef.current = false
    // Offset is applied to the canonical market rate directly.
    setLimitPrice(String(marketCanonical * (1 + pct / 100)))
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
      </CardBodyRow>
      <ChipContainer sx={{ marginTop: 0.5, flexWrap: 'wrap' }}>
        {PRESETS.map((pct) => (
          <PriceChip key={pct} onClick={() => handlePreset(pct)}>
            {pct === 0 ? t('limitOrder.market') : `+${pct}%`}
          </PriceChip>
        ))}
      </ChipContainer>
    </AmountCard>
  )
}
