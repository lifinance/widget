import Check from '@mui/icons-material/Check'
import CloseRounded from '@mui/icons-material/CloseRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Box, Collapse, List, Typography } from '@mui/material'
import type { ChangeEventHandler, FocusEventHandler } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ListItemText } from '../../../components/ListItemText.js'
import { PageContainer } from '../../../components/PageContainer.js'
import { SettingsListItemButton } from '../../../components/SettingsListItemButton.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { useListHeight } from '../../../hooks/useListHeight.js'
import { useSettingMonitor } from '../../../hooks/useSettingMonitor.js'
import { defaultSlippage } from '../../../stores/settings/createSettingsStore.js'
import { useSettings } from '../../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../../stores/settings/useSettingsActions.js'
import { formatInputAmount, formatSlippage } from '../../../utils/format.js'
import {
  SlippageClearButton,
  SlippageInput,
  SlippageLimitsWarningContainer,
} from './SlippageSettings.style.js'

const slippagePresets = ['0.5', '1']
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
  const listParentRef = useRef<HTMLUListElement | null>(null)
  const { listHeight } = useListHeight({ listParentRef })

  useHeader(t('settings.slippage'))

  const isAuto = !slippage || slippage === defaultSlippage
  const isPreset = !!slippage && slippagePresets.includes(slippage)
  const isCustom = !isAuto && !isPreset

  const [customMode, setCustomMode] = useState(isCustom)
  const [inputValue, setInputValue] = useState(isCustom ? (slippage ?? '') : '')

  const handleAuto = () => {
    setCustomMode(false)
    setInputValue('')
    setValue('slippage', defaultSlippage)
  }

  const handlePreset = (preset: string) => {
    setCustomMode(false)
    setValue('slippage', preset)
  }

  const handleCustom = () => {
    setCustomMode(true)
    const initialValue = slippage || ''
    if (initialValue) {
      setInputValue(initialValue)
      setValue('slippage', initialValue)
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
        className="long-list"
        ref={listParentRef}
        style={{ height: listHeight, overflow: 'auto' }}
        sx={{
          padding: 1.5,
        }}
      >
        <SettingsListItemButton onClick={handleAuto}>
          <ListItemText
            primary={t('button.auto')}
            secondary={t('settings.slippageAutoDescription')}
          />
          {!customMode && isAuto && <Check color="primary" />}
        </SettingsListItemButton>
        {slippagePresets.map((preset) => (
          <SettingsListItemButton
            key={preset}
            onClick={() => handlePreset(preset)}
          >
            <ListItemText primary={`${preset}%`} />
            {!customMode && slippage === preset && <Check color="primary" />}
          </SettingsListItemButton>
        ))}
        <SettingsListItemButton onClick={handleCustom}>
          <ListItemText primary={t('settings.custom')} />
          {customMode && <Check color="primary" />}
        </SettingsListItemButton>
        <Collapse in={customMode}>
          <Box sx={{ px: 1.5, pt: 1 }}>
            <SlippageInput
              placeholder="0.5"
              inputProps={{ inputMode: 'decimal' }}
              value={inputValue}
              onChange={handleInputUpdate}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
              endAdornment={
                !isAuto && (
                  <SlippageClearButton
                    size="small"
                    onClick={handleAuto}
                    aria-label="Clear"
                  >
                    <CloseRounded fontSize="small" />
                  </SlippageClearButton>
                )
              }
            />
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
        </Collapse>
      </List>
    </PageContainer>
  )
}
