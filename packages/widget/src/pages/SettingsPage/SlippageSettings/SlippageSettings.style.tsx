import type { Theme } from '@mui/material'
import {
  Box,
  ButtonBase,
  InputBase,
  inputBaseClasses,
  styled,
} from '@mui/material'
import type React from 'react'

export const SettingsFieldSet: React.FC<
  React.ComponentProps<typeof Box> & SettingsControlProps
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderRadius: theme.vars.shape.borderRadius,
  padding: theme.spacing(0.5),
  gap: theme.spacing(0.5),
  height: '3.5rem',
  backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  ...theme.applyStyles('dark', {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
  }),
}))

const settingsControlSelected = (theme: Theme) => ({
  backgroundColor: theme.vars.palette.background.paper,
  boxShadow: `0px 2px 4px rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  ...theme.applyStyles('dark', {
    backgroundColor: `rgba(${theme.vars.palette.common.backgroundChannel} / 0.56)`,
    boxShadow: `0px 2px 4px rgba(${theme.vars.palette.common.backgroundChannel} / 0.04)`,
  }),
  borderRadius: `calc(${theme.vars.shape.borderRadius} - 4px)`,
})

interface SettingsControlProps {
  selected?: boolean
}

export const SettingsDefaultButton: React.FC<
  React.ComponentProps<typeof ButtonBase> & SettingsControlProps
> = styled(ButtonBase)<SettingsControlProps>(({ theme, selected }) => {
  const settingsControlSelectedStyles = settingsControlSelected(theme)
  const selectedStyle = selected
    ? {
        '&:not(:focus)': {
          ...settingsControlSelectedStyles,
        },
      }
    : {}

  return {
    height: '100%',
    width: '100%',
    fontSize: '1rem',
    fontWeight: 700,
    '&:focus': {
      ...settingsControlSelectedStyles,
    },
    ...selectedStyle,
  }
})

export const SettingsCustomInput: React.FC<
  React.ComponentProps<typeof InputBase> & SettingsControlProps
> = styled(InputBase)<SettingsControlProps>(({ theme, selected }) => {
  const settingsControlSelectedStyles = settingsControlSelected(theme)
  const selectedStyle = selected
    ? {
        '&:not(:focus)': {
          ...settingsControlSelectedStyles,
        },
      }
    : {}

  return {
    height: '100%',
    width: '100%',
    [`.${inputBaseClasses.input}`]: {
      height: '100%',
      width: '100%',
      padding: 0,
      textAlign: 'center',
      '&::placeholder': {
        fontSize: '1rem',
        fontWeight: 700,
        opacity: 1,
      },
      '&:focus': {
        ...settingsControlSelectedStyles,
      },
      ...selectedStyle,
    },
  }
})

export const SlippageLimitsWarningContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.25),
  marginTop: theme.spacing(1.5),
}))
