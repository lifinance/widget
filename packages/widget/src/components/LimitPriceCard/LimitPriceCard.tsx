import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import type { CardProps } from '@mui/material'
import { type ChangeEvent, type JSX, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useLimitMarketRate } from '../../hooks/useLimitMarketRate.js'
import { useLinkedLimitFields } from '../../hooks/useLinkedLimitFields.js'
import { useToken } from '../../hooks/useToken.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useLimitOrderStore } from '../../stores/limitOrder/useLimitOrderStore.js'
import { formatInputAmount } from '../../utils/format.js'
import { invertPrice, proximityPercent } from '../../utils/limitOrder.js'
import { TokenAvatar } from '../Avatar/TokenAvatar.js'
import { CardTitle } from '../Card/CardTitle.js'
import {
  AmountCard,
  CardBodyRow,
  CardHeaderRow,
  LargeInput,
  TokenChip,
  TokenSymbol,
} from '../LimitOrderCard/LimitOrderCard.style.js'
import {
  ChipsRow,
  InvertChip,
  OffMarketAlert,
  PresetChip,
} from './LimitPriceCard.style.js'

/** Quick-set presets, as percentage offsets from market (0 = at market). */
const PRESETS = [0, 1, 5, 10] as const
/** |distance| at/above which the limit is flagged as far from market. */
const OFF_MARKET_THRESHOLD = 10

const cleanDisplay = (value: string): string =>
  value ? formatInputAmount(value, 8) : ''

const isPresetActive = (distPct: number, presetPct: number): boolean => {
  if (!Number.isFinite(distPct)) {
    return false
  }
  if (presetPct === 0) {
    return Math.abs(distPct) < 0.5
  }
  // Only positive offsets match a "+N%" preset; band absorbs string round-trip.
  return distPct > 0 && Math.abs(distPct - presetPct) <= 1
}

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
  const { chain: unitChain } = useChain(priceInverted ? fromChainId : toChainId)

  const marketCanonical = useLimitMarketRate()

  // Canonical price is orientation-independent; flip only for display.
  const displayPrice = priceInverted ? invertPrice(limitPrice) : limitPrice

  // Proximity and presets always operate on the canonical (receive-per-send)
  // rate so "+N%" consistently means N% above market regardless of which
  // direction the price is currently displayed in.
  const distPct = proximityPercent(limitPrice, marketCanonical)
  const offMarket =
    Number.isFinite(distPct) && Math.abs(distPct) >= OFF_MARKET_THRESHOLD

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
    <AmountCard {...props}>
      <CardHeaderRow>
        <CardTitle sx={{ padding: 0 }}>{label}</CardTitle>
        {hasTokens ? (
          <InvertChip onClick={handleInvert} aria-label="invert price">
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
        {unitToken ? (
          <TokenChip>
            <TokenAvatar
              token={unitToken}
              chain={unitChain}
              tokenAvatarSize={20}
              chainAvatarSize={10}
            />
            <TokenSymbol>{unitToken.symbol}</TokenSymbol>
          </TokenChip>
        ) : null}
      </CardBodyRow>
      {hasTokens ? (
        <ChipsRow>
          {PRESETS.map((pct) => (
            <PresetChip
              key={pct}
              selected={isPresetActive(distPct, pct)}
              onClick={() => handlePreset(pct)}
            >
              {pct === 0 ? t('limitOrder.market') : `+${pct}%`}
            </PresetChip>
          ))}
        </ChipsRow>
      ) : null}
      {offMarket ? (
        <OffMarketAlert>
          {t('limitOrder.fromMarket', {
            percent: `${distPct > 0 ? '+' : ''}${distPct.toFixed(1)}%`,
          })}
        </OffMarketAlert>
      ) : null}
    </AmountCard>
  )
}
