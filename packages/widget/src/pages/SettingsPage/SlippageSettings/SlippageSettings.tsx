import Percent from '@mui/icons-material/Percent'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Box, Typography } from '@mui/material'
import type { ChangeEventHandler, FocusEventHandler } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingMonitor } from '../../../hooks/useSettingMonitor.js'
import { useSettings } from '../../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../../stores/settings/useSettingsActions.js'
import { defaultSlippage } from '../../../stores/settings/useSettingsStore.js'
import { formatInputAmount, formatSlippage } from '../../../utils/format.js'
import { BadgedValue } from '../SettingsCard/BadgedValue.js'
import { SettingCardExpandable } from '../SettingsCard/SettingCardExpandable.js'
import {
  SettingsFieldSet,
  SlippageCustomInput,
  SlippageDefaultButton,
  SlippageLimitsWarningContainer,
} from './SlippageSettings.style.js'

const maxFractionDigits = 5

export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation()
  const {
    isSlippageNotRecommended,
    isSlippageUnderRecommendedLimits,
    isSlippageOutsideRecommendedLimits,
    isSlippageChanged,
  } = useSettingMonitor()
  const { slippage } = useSettings(['slippage'])
  const { setValue } = useSettingsActions()
  const defaultValue = useRef(slippage)
  const [focused, setFocused] = useState<'input' | 'button'>()

  const handleDefaultClick = () => {
    setValue('slippage', defaultSlippage)
  }

  const formatAndSetSlippage = (value: string, returnInitial = false) => {
    const formattedValue = formatInputAmount(
      formatSlippage(value, defaultValue.current, returnInitial),
      maxFractionDigits,
      returnInitial
    )
    setValue(
      'slippage',
      formattedValue.length ? formattedValue : defaultSlippage
    )
  }

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    formatAndSetSlippage(event.target.value, true)
  }

  const handleInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused('input')
    formatAndSetSlippage(event.target.value)
  }

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(undefined)
    formatAndSetSlippage(event.target.value)
  }

  const badgeColor = isSlippageNotRecommended
    ? 'warning'
    : isSlippageChanged
      ? 'info'
      : undefined

  const slippageWarningText = isSlippageOutsideRecommendedLimits
    ? t('warning.message.slippageOutsideRecommendedLimits')
    : isSlippageUnderRecommendedLimits
      ? t('warning.message.slippageUnderRecommendedLimits')
      : ''

  return (
    <SettingCardExpandable
      value={
        <BadgedValue badgeColor={badgeColor} showBadge={!!badgeColor}>
          {slippage ? `${slippage}%` : t('button.auto')}
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
            {t('button.auto')}
          </SlippageDefaultButton>
          <SlippageCustomInput
            selected={defaultSlippage !== slippage && focused !== 'button'}
            placeholder={focused === 'input' ? '' : t('settings.custom')}
            inputProps={{
              inputMode: 'decimal',
            }}
            onChange={handleInputUpdate}
            onFocus={handleInputFocus}
            value={slippage}
            autoComplete="off"
            onBlur={handleInputBlur}
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
