import { type ChangeEvent, type JSX, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChipContainer } from '../AmountInputCard/PercentageChips.style.js'
import {
  EditablePriceChip,
  PriceChip,
  PriceChipInput,
} from './LimitPriceCard.style.js'

/** Quick-set presets, as percentage offsets from market (0 = at market). */
const PRESETS = [0, 1, 5, 10] as const

interface LimitPricePresetsProps {
  /** Apply a percentage offset from the market rate (0 = at market). */
  onSelect: (pct: number) => void
  /** Disables the free-form custom pill (no tokens / no market rate yet). */
  disabled: boolean
}

/**
 * Row of quick-set price controls: fixed percentage presets plus a free-form
 * "custom %" pill that collapses to a button until engaged. Owns its own
 * custom-input state so the card only deals with applying an offset.
 */
export const LimitPricePresets = ({
  onSelect,
  disabled,
}: LimitPricePresetsProps): JSX.Element => {
  const { t } = useTranslation()
  const customInputRef = useRef<HTMLInputElement>(null)
  const [customPct, setCustomPct] = useState('')
  const [customFocused, setCustomFocused] = useState(false)

  // The custom pill renders as a plain button until engaged; when it flips into
  // edit mode (focused), move the caret into the freshly-mounted input.
  useEffect(() => {
    if (customFocused) {
      customInputRef.current?.focus()
    }
  }, [customFocused])

  // Picking a fixed preset clears any custom value so the custom pill collapses
  // back to its "Custom" button instead of showing a stale, no-longer-applied %.
  const handlePresetClick = (pct: number): void => {
    setCustomPct('')
    setCustomFocused(false)
    onSelect(pct)
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
    onSelect(numeric)
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

  // Collapse to a plain "Custom" label only while empty and unfocused; once the
  // user engages (focus) or has typed a value, reveal the `+__%` affixes.
  const showCustomLabel = customPct === '' && !customFocused

  return (
    <ChipContainer sx={{ marginTop: 0.5, flexWrap: 'wrap' }}>
      {PRESETS.map((pct) => (
        <PriceChip key={pct} onClick={() => handlePresetClick(pct)}>
          {pct === 0 ? t('limitOrder.market') : `+${pct}%`}
        </PriceChip>
      ))}
      {showCustomLabel ? (
        <PriceChip disabled={disabled} onClick={() => setCustomFocused(true)}>
          {t('limitOrder.custom')}
        </PriceChip>
      ) : (
        <EditablePriceChip
          aria-disabled={disabled}
          onClick={(event) => {
            // `aria-disabled` only announces the state; enforce it so a
            // programmatic click can't apply an offset while disabled.
            if (disabled) {
              return
            }
            const input = event.currentTarget.querySelector('input')
            input?.focus()
            const numeric = Number(customPct)
            if (customPct && !Number.isNaN(numeric)) {
              onSelect(numeric)
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
            disabled={disabled}
            style={{ width: `${Math.max(customPct.length, 1)}ch` }}
          />
          %
        </EditablePriceChip>
      )}
    </ChipContainer>
  )
}
