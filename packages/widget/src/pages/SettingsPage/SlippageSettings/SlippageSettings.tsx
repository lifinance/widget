import { Percent, WarningRounded } from '@mui/icons-material'
import { Box, Typography, debounce } from '@mui/material'
import type { ChangeEventHandler, FocusEventHandler } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingMonitor } from '../../../hooks/useSettingMonitor.js'
import { useSettings } from '../../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../../stores/settings/useSettingsActions.js'
import { defaultSlippage } from '../../../stores/settings/useSettingsStore.js'
import { formatSlippage } from '../../../utils/format.js'
import { BadgedValue } from '../SettingsCard/BadgedValue.js'
import { SettingCardExpandable } from '../SettingsCard/SettingCardExpandable.js'
import {
  SettingsFieldSet,
  SlippageCustomInput,
  SlippageDefaultButton,
  SlippageLimitsWarningContainer,
} from './SlippageSettings.style.js'

const DEFAULT_CUSTOM_INPUT_VALUE = '1'

export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation()
  const {
    isSlippageUnderRecommendedLimits,
    isSlippageOutsideRecommendedLimits,
    isSlippageChanged,
  } = useSettingMonitor()
  const { slippage } = useSettings(['slippage'])
  const { setValue } = useSettingsActions()
  const defaultValue = useRef(slippage)
  const [focused, setFocused] = useState<'input' | 'button'>()

  const customInputValue =
    !slippage || slippage === defaultSlippage
      ? DEFAULT_CUSTOM_INPUT_VALUE
      : slippage

  const [inputValue, setInputValue] = useState(customInputValue)

  const handleDefaultClick = () => {
    setValue('slippage', defaultSlippage)
  }

  const debouncedSetValue = useMemo(() => debounce(setValue, 500), [setValue])

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target

      setInputValue(formatSlippage(value, defaultValue.current, true))

      debouncedSetValue(
        'slippage',
        formatSlippage(value || defaultSlippage, defaultValue.current, true)
      )
    },
    [debouncedSetValue]
  )

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(undefined)

    const { value } = event.target

    const formattedValue = formatSlippage(value, defaultValue.current)
    setInputValue(formattedValue)

    setValue(
      'slippage',
      formattedValue.length ? formattedValue : defaultSlippage
    )
  }

  const badgeColor = isSlippageOutsideRecommendedLimits
    ? 'warning'
    : isSlippageChanged
      ? 'info'
      : undefined

  const isSlippageNotRecommended = Boolean(
    isSlippageOutsideRecommendedLimits || isSlippageUnderRecommendedLimits
  )

  const slippageWarningText = isSlippageOutsideRecommendedLimits
    ? t('warning.message.slippageOutsideRecommendedLimits')
    : isSlippageUnderRecommendedLimits
      ? t('warning.message.slippageUnderRecommendedLimits')
      : ''

  return (
    <SettingCardExpandable
      value={
        <BadgedValue badgeColor={badgeColor} showBadge={!!badgeColor}>
          {slippage ? `${slippage}%` : t('settings.defaultSlippage')}
        </BadgedValue>
      }
      icon={<Percent />}
      title={t('settings.slippage')}
    >
      <Box
        sx={{
          mt: 1.5,
        }}
      >
        <SettingsFieldSet>
          <SlippageDefaultButton
            selected={defaultSlippage === slippage && focused !== 'input'}
            onFocus={() => {
              setFocused('button')
            }}
            onBlur={() => {
              setFocused(undefined)
            }}
            onClick={handleDefaultClick}
            disableRipple
          >
            {t('settings.defaultSlippage')}
          </SlippageDefaultButton>
          <SlippageCustomInput
            selected={defaultSlippage !== slippage && focused !== 'button'}
            placeholder={focused === 'input' ? '' : t('settings.custom')}
            inputProps={{
              inputMode: 'decimal',
            }}
            onChange={handleInputUpdate}
            onFocus={() => {
              setFocused('input')
            }}
            onBlur={handleInputBlur}
            value={inputValue}
            autoComplete="off"
          />
        </SettingsFieldSet>
        {isSlippageNotRecommended && (
          <SlippageLimitsWarningContainer>
            <WarningRounded color="warning" />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 400,
              }}
            >
              {slippageWarningText}
            </Typography>
          </SlippageLimitsWarningContainer>
        )}
      </Box>
    </SettingCardExpandable>
  )
}
