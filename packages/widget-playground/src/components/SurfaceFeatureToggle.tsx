import { Collapse } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import { ToggleRow, ToggleRowLabel } from './Row.style.js'
import { Switch } from './Switch.style.js'

interface SurfaceFeatureToggleProps {
  title: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  sx?: React.ComponentProps<typeof ToggleRow>['sx']
  children: ReactNode
}

export const SurfaceFeatureToggle = ({
  title,
  label,
  checked,
  onChange,
  sx,
  children,
}: SurfaceFeatureToggleProps): JSX.Element => {
  return (
    <>
      <ToggleRow sx={sx}>
        <ToggleRowLabel>{label}</ToggleRowLabel>
        <Switch
          checked={checked}
          onChange={(_, nextChecked) => onChange(nextChecked)}
          aria-label={`${title} ${label.toLowerCase()}`}
        />
      </ToggleRow>
      <Collapse in={checked} unmountOnExit>
        {children}
      </Collapse>
    </>
  )
}
