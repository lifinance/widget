import Check from '@mui/icons-material/Check'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import type { BoxProps } from '@mui/material'
import { FormControlLabel, Menu, MenuItem, Switch } from '@mui/material'
import { type ChangeEvent, type JSX, type MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLimitOrderStore } from '../../stores/limitOrder/useLimitOrderStore.js'
import { formatDuration } from '../../utils/format.js'
import { Card } from '../Card/Card.js'
import {
  Container,
  ExpiryValue,
  QuickSettingButton,
  QuickSettingTitle,
  QuickSettingValue,
  SettingsRow,
} from './LimitOrderSettings.style.js'

/** Selectable order-validity durations, in seconds. */
const DURATIONS = [3600, 86400, 604800, 2592000, 31536000]

export const LimitOrderSettings: React.FC<BoxProps> = (props): JSX.Element => {
  const { t, i18n } = useTranslation()
  const validUntil = useLimitOrderStore((state) => state.validUntil)
  const setValidUntil = useLimitOrderStore((state) => state.setValidUntil)
  const partiallyFillable = useLimitOrderStore(
    (state) => state.partiallyFillable
  )
  const setPartiallyFillable = useLimitOrderStore(
    (state) => state.setPartiallyFillable
  )
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const handleSelect = (duration: number): void => {
    setValidUntil(duration)
    setAnchorEl(null)
  }

  const handlePartiallyFillableChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setPartiallyFillable(event.target.checked)
  }

  return (
    <Container {...props}>
      <Card>
        <QuickSettingButton
          onClick={handleOpen}
          disableRipple
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <QuickSettingTitle>{t('limitOrder.expiresIn')}</QuickSettingTitle>
          <ExpiryValue>
            <QuickSettingValue>
              {formatDuration(validUntil, i18n.language, 'long')}
            </QuickSettingValue>
            <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
          </ExpiryValue>
        </QuickSettingButton>
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
            sx={{ justifyContent: 'space-between', gap: 4 }}
          >
            {formatDuration(duration, i18n.language, 'long')}
            {duration === validUntil ? (
              <Check color="primary" fontSize="small" />
            ) : null}
          </MenuItem>
        ))}
      </Menu>
      <SettingsRow>
        <FormControlLabel
          control={
            <Switch
              checked={partiallyFillable}
              onChange={handlePartiallyFillableChange}
            />
          }
          label={t('limitOrder.partiallyFillable')}
        />
      </SettingsRow>
    </Container>
  )
}
