import Check from '@mui/icons-material/Check'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Box, List, Typography } from '@mui/material'
import type { ChangeEventHandler, FocusEventHandler } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ListItemText } from '../../../components/ListItemText.js'
import { PageContainer } from '../../../components/PageContainer.js'
import { SettingsListItemButton } from '../../../components/SettingsListItemButton.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { useSettingMonitor } from '../../../hooks/useSettingMonitor.js'
import { defaultSlippage } from '../../../stores/settings/createSettingsStore.js'
import { useSettings } from '../../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../../stores/settings/useSettingsActions.js'
import { formatInputAmount, formatSlippage } from '../../../utils/format.js'
import {
  SettingsCustomInput,
  SettingsFieldSet,
  SlippageLimitsWarningContainer,
} from './SlippageSettings.style.js'

const slippagePresets = ['0.5', '1', '3']
const maxFractionDigits = 5

export const SlippagePage: React.FC = () => {
  const { t } = useTranslation()
  const {
    isSlippageNotRecommended,
    isSlippageUnderRecommendedLimits,
    isSlippageOutsideRecommendedLimits,
  } = useSettingMonitor()
  const { slippage } = useSettings(['slippage'])
  const { setValue } = useSettingsActions()
  const defaultValue = useRef(slippage)

  useHeader(t('settings.slippage'))

  const isAuto = !slippage || slippage === defaultSlippage
  const isPreset = !!slippage && slippagePresets.includes(slippage)
  const isCustom = !isAuto && !isPreset

  const [customMode, setCustomMode] = useState(isCustom)
  const [inputValue, setInputValue] = useState(isCustom ? slippage : '')

  const handleAuto = () => {
    setCustomMode(false)
    setValue('slippage', defaultSlippage)
  }

  const handlePreset = (preset: string) => {
    setCustomMode(false)
    setValue('slippage', preset)
  }

  const handleCustom = () => {
    setCustomMode(true)
    if (inputValue) {
      setValue('slippage', inputValue)
    }
  }

  const formatAndSetSlippage = (value: string, returnInitial = false) => {
    const formattedSlippage = formatSlippage(
      value,
      defaultValue.current,
      returnInitial
    )
    const formattedValue =
      Number(formattedSlippage) === 0 && !returnInitial
        ? '0'
        : formatInputAmount(formattedSlippage, maxFractionDigits, returnInitial)
    const maxLength =
      Number(formattedValue) < 10
        ? maxFractionDigits + 2
        : maxFractionDigits + 3
    const slicedValue = formattedValue.slice(0, maxLength)
    setInputValue(slicedValue)
    setValue('slippage', slicedValue.length ? slicedValue : defaultSlippage)
  }

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    formatAndSetSlippage(event.target.value, true)
  }

  const handleInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    formatAndSetSlippage(event.target.value)
  }

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    formatAndSetSlippage(event.target.value)
  }

  const slippageWarningText = isSlippageOutsideRecommendedLimits
    ? t('warning.message.slippageOutsideRecommendedLimits')
    : isSlippageUnderRecommendedLimits
      ? t('warning.message.slippageUnderRecommendedLimits')
      : ''

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          padding: 1.5,
        }}
      >
        <SettingsListItemButton onClick={handleAuto}>
          <ListItemText
            primary={t('button.auto')}
            secondary={t('settings.slippageAutoDescription')}
          />
          {isAuto && <Check color="primary" />}
        </SettingsListItemButton>
        {slippagePresets.map((preset) => (
          <SettingsListItemButton
            key={preset}
            onClick={() => handlePreset(preset)}
          >
            <ListItemText primary={`${preset}%`} />
            {slippage === preset && <Check color="primary" />}
          </SettingsListItemButton>
        ))}
        <SettingsListItemButton onClick={handleCustom}>
          <ListItemText primary={t('settings.custom')} />
          {isCustom && <Check color="primary" />}
        </SettingsListItemButton>
      </List>
      {customMode && (
        <Box sx={{ px: 1.5 }}>
          <SettingsFieldSet>
            <SettingsCustomInput
              selected
              placeholder="0.5"
              inputProps={{
                inputMode: 'decimal',
              }}
              value={inputValue}
              onChange={handleInputUpdate}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
            />
          </SettingsFieldSet>
        </Box>
      )}
      {isSlippageNotRecommended && (
        <SlippageLimitsWarningContainer sx={{ px: 1.5 }}>
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
    </PageContainer>
  )
}
