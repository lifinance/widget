import AttachMoney from '@mui/icons-material/AttachMoney'
import { Box } from '@mui/material'
import type { ChangeEventHandler, FocusEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../stores/settings/useSettingsActions.js'
import { formatInputAmount } from '../../utils/format.js'
import { BadgedValue } from './SettingsCard/BadgedValue.js'
import { SettingCardExpandable } from './SettingsCard/SettingCardExpandable.js'
import {
  SettingsCustomInput,
  SettingsDefaultButton,
  SettingsFieldSet,
} from './SlippageSettings/SlippageSettings.style.js'

const defaultThreshold = '0.01'
const maxFractionDigits = 2

export const SmallBalanceFilterSettings: React.FC = () => {
  const { t } = useTranslation()
  const { hideSmallBalances, smallBalanceThreshold } = useSettings([
    'hideSmallBalances',
    'smallBalanceThreshold',
  ])
  const { setValue } = useSettingsActions()
  const defaultValue = useRef(smallBalanceThreshold || defaultThreshold)
  const [focused, setFocused] = useState<'input' | 'button'>()

  const thresholdValue = smallBalanceThreshold || defaultThreshold
  const isAuto = !hideSmallBalances
  const customInputValue = isAuto ? defaultThreshold : thresholdValue
  const [inputValue, setInputValue] = useState(customInputValue)

  // Sync input value when threshold changes externally or when switching modes
  useEffect(() => {
    if (!focused) {
      setInputValue(customInputValue)
    }
  }, [customInputValue, focused])

  const handleDefaultClick = () => {
    setValue('hideSmallBalances', false)
  }

  const formatAndSetThreshold = (value: string, returnInitial = false) => {
    const parsedValue = Number.parseFloat(value)
    if (Number.isNaN(parsedValue) && value !== '') {
      if (returnInitial) {
        setInputValue(value)
        return
      }
      setInputValue(defaultValue.current)
      setValue('smallBalanceThreshold', defaultValue.current)
      setValue('hideSmallBalances', true)
      return
    }

    const formattedValue =
      Number.isNaN(parsedValue) || parsedValue < 0
        ? '0'
        : formatInputAmount(value, maxFractionDigits, returnInitial)
    const maxLength =
      Number(formattedValue) < 10
        ? maxFractionDigits + 2
        : maxFractionDigits + 3
    const slicedValue = formattedValue.slice(0, maxLength)
    setInputValue(slicedValue)
    if (slicedValue.length) {
      setValue('smallBalanceThreshold', slicedValue)
      setValue('hideSmallBalances', true)
    }
  }

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    formatAndSetThreshold(event.target.value, true)
  }

  const handleInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused('input')
    formatAndSetThreshold(event.target.value)
  }

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(undefined)
    formatAndSetThreshold(event.target.value)
  }

  const displayValue = isAuto
    ? t('settings.hideSmallBalances.showAll')
    : t('settings.hideSmallBalances.threshold', {
        threshold: thresholdValue,
        maximumFractionDigits: 5,
      })

  return (
    <SettingCardExpandable
      value={<BadgedValue showBadge={false}>{displayValue}</BadgedValue>}
      icon={<AttachMoney />}
      title={t('settings.hideSmallBalances.title')}
    >
      <Box
        sx={{
          mt: 1.5,
        }}
      >
        <SettingsFieldSet>
          <SettingsDefaultButton
            selected={isAuto && focused !== 'input'}
            onFocus={() => {
              setFocused('button')
            }}
            onBlur={() => {
              setFocused(undefined)
            }}
            onClick={handleDefaultClick}
            disableRipple
          >
            {t('settings.hideSmallBalances.showAll')}
          </SettingsDefaultButton>
          <SettingsCustomInput
            selected={!isAuto && focused !== 'button'}
            inputProps={{
              inputMode: 'decimal',
            }}
            onChange={handleInputUpdate}
            onFocus={handleInputFocus}
            value={inputValue}
            autoComplete="off"
            onBlur={handleInputBlur}
          />
        </SettingsFieldSet>
      </Box>
    </SettingCardExpandable>
  )
}
