import { Divider } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import { Switch } from '../Switch.style.js'
import {
  DevToggleRow,
  ToggleDescription,
  ToggleItem,
  ToggleLabel,
} from './DeveloperControlsDetailView.style.js'

interface DeveloperToggleItemProps {
  label: string
  description?: string
  checked?: boolean
  onChange?: React.ComponentProps<typeof Switch>['onChange']
  disabled?: boolean
  ariaLabel?: string
  leadingDivider?: boolean
  hideSwitch?: boolean
  switchSize?: 'small' | 'medium'
  children?: ReactNode
}

export const DeveloperToggleItem = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  leadingDivider = true,
  hideSwitch = false,
  switchSize,
  children,
}: DeveloperToggleItemProps): JSX.Element => {
  return (
    <>
      {leadingDivider ? <Divider /> : null}
      <ToggleItem
        sx={{
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <DevToggleRow>
          <ToggleLabel>{label}</ToggleLabel>
          {!hideSwitch && checked !== undefined && onChange ? (
            <Switch
              size={switchSize}
              checked={checked}
              onChange={onChange}
              aria-label={ariaLabel}
            />
          ) : null}
        </DevToggleRow>
        {description ? (
          <ToggleDescription>{description}</ToggleDescription>
        ) : null}
        {children}
      </ToggleItem>
    </>
  )
}
