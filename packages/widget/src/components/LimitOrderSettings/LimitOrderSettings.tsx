import Check from '@mui/icons-material/Check'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import type { BoxProps } from '@mui/material'
import { Menu, MenuItem } from '@mui/material'
import { type ChangeEvent, type JSX, type MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { formatDuration } from '../../utils/format.js'
import { Card } from '../Card/Card.js'
import { Switch } from '../Switch.js'
import {
  Container,
  ExpiryValue,
  SettingItemButton,
  SettingItemTitle,
  SettingItemValue,
  SettingsRow,
  ToggleLabel,
} from './LimitOrderSettings.style.js'

/** Selectable order-validity durations, in seconds. */
const DURATIONS = [3600, 86400, 604800, 2592000, 31536000]

export const LimitOrderSettings: React.FC<BoxProps> = (props): JSX.Element => {
  const { t, i18n } = useTranslation()
  const [validUntil, partiallyFillable] = useFieldValues(
    'validUntil',
    'partiallyFillable'
  )
  const { setFieldValue } = useFieldActions()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const handleSelect = (duration: number): void => {
    setFieldValue('validUntil', duration)
    setAnchorEl(null)
  }

  const handlePartiallyFillableChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setFieldValue('partiallyFillable', event.target.checked)
  }

  return (
    <Container {...props}>
      <Card>
        <SettingItemButton
          onClick={handleOpen}
          disableRipple
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <SettingItemTitle>{t('limitOrder.expiresIn')}</SettingItemTitle>
          <ExpiryValue>
            <SettingItemValue>
              {formatDuration(validUntil, i18n.language, 'long')}
            </SettingItemValue>
            <KeyboardArrowDownIcon
              sx={{ fontSize: 20, height: '18px', marginTop: '2px' }}
            />
          </ExpiryValue>
        </SettingItemButton>
      </Card>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: (theme) => ({
              border: `1px solid ${theme.vars.palette.grey[300]}`,
              boxShadow: 'none',
              ...theme.applyStyles('dark', {
                borderColor: theme.vars.palette.grey[800],
              }),
            }),
          },
        }}
      >
        {DURATIONS.map((duration) => (
          <MenuItem
            key={duration}
            onClick={() => handleSelect(duration)}
            sx={(theme) => ({
              justifyContent: 'space-between',
              gap: 4,
              fontSize: 14,
              fontWeight: 700,
              lineHeight: '18px',
              color: theme.vars.palette.text.primary,
            })}
          >
            {formatDuration(duration, i18n.language, 'long')}
            {duration === validUntil ? (
              <Check color="primary" fontSize="small" />
            ) : null}
          </MenuItem>
        ))}
      </Menu>
      <Card>
        <SettingsRow>
          <ToggleLabel>{t('limitOrder.partiallyFillable')}</ToggleLabel>
          <Switch
            checked={partiallyFillable}
            onChange={handlePartiallyFillableChange}
            aria-label={t('limitOrder.partiallyFillable')}
          />
        </SettingsRow>
      </Card>
    </Container>
  )
}
