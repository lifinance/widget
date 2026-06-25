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
import {
  EditablePriceChip,
  InvertChip,
  PriceChip,
  PriceChipInput,
} from './LimitPriceCard.style.js'

/** Quick-set presets, as percentage offsets from market (0 = at market). */
const PRESETS = [0, 1, 5, 10] as const

const cleanDisplay = (value: string): string =>
  value ? formatInputAmount(value, 8) : ''

export const LimitPriceCard: React.FC<CardProps> = (props): JSX.Element => {
  const { t } = useTranslation()
  const isEditingRef = useRef(false)
  const customInputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [customPct, setCustomPct] = useState('')
  const [customFocused, setCustomFocused] = useState(false)

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

  // The custom pill renders as a plain button until engaged; when it flips into
  // edit mode (focused), move the caret into the freshly-mounted input.
  useEffect(() => {
    if (customFocused) {
      customInputRef.current?.focus()
    }
  }, [customFocused])

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

  // Picking a fixed preset clears any custom value so the custom pill collapses
  // back to its "Custom" button instead of showing a stale, no-longer-applied %.
  const handlePresetClick = (pct: number): void => {
    setCustomPct('')
    setCustomFocused(false)
    handlePreset(pct)
  }

  // Free-form offset pill: apply the typed percentage live so the price input
  // tracks the offset as the user types. Accepts an optional leading +/- sign
  // so the price can be set above (premium) or below (discount) market.
  const handleCustomChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const raw = event.target.value
    if (raw && !/^[+-]?\d*\.?\d*$/.test(raw)) {
      return
    }
    setCustomPct(raw)
    const numeric = Number(raw)
    // Bare '', '+', '-', '.' etc. aren't applicable numbers yet — Number() maps
    // the signs/dot to NaN, and '' to 0, so guard both.
    if (raw === '' || Number.isNaN(numeric)) {
      return
    }
    handlePreset(numeric)
  }

  const handleCustomKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }
  }

  // On blur, surface an explicit sign: a bare positive entry like "10" reads as
  // "+10" so the direction (above/below market) is unambiguous once collapsed.
  const handleCustomBlur = (): void => {
    setCustomFocused(false)
    setCustomPct((prev) => {
      if (!prev || prev.startsWith('+') || prev.startsWith('-')) {
        return prev
      }
      return Number.isNaN(Number(prev)) ? prev : `+${prev}`
    })
  }

  const customDisabled = !hasTokens || marketCanonical === undefined
  // Collapse to a plain "Custom" label only while empty and unfocused; once the
  // user engages (focus) or has typed a value, reveal the `+__%` affixes.
  const customLabel = t('limitOrder.custom')
  const showCustomLabel = customPct === '' && !customFocused

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
          <PriceChip key={pct} onClick={() => handlePresetClick(pct)}>
            {pct === 0 ? t('limitOrder.market') : `+${pct}%`}
          </PriceChip>
        ))}
        {showCustomLabel ? (
          <PriceChip
            disabled={customDisabled}
            onClick={() => setCustomFocused(true)}
          >
            {customLabel}
          </PriceChip>
        ) : (
          <EditablePriceChip
            aria-disabled={customDisabled}
            onClick={(event) => {
              const input = event.currentTarget.querySelector('input')
              input?.focus()
              const numeric = Number(customPct)
              if (customPct && !Number.isNaN(numeric)) {
                handlePreset(numeric)
              }
            }}
          >
            <PriceChipInput
              ref={customInputRef}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              aria-label={t('limitOrder.custom')}
              value={customPct}
              onChange={handleCustomChange}
              onKeyDown={handleCustomKeyDown}
              onFocus={() => setCustomFocused(true)}
              onBlur={handleCustomBlur}
              disabled={customDisabled}
              style={{ width: `${Math.max(customPct.length, 1)}ch` }}
            />
            %
          </EditablePriceChip>
        )}
      </ChipContainer>
    </AmountCard>
  )
}
