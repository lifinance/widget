import type { Theme } from '@mui/material'
import {
  Box,
  IconButton,
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
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  ...theme.applyStyles('dark', {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
  }),
}))

const settingsControlSelected = (theme: Theme) => ({
  backgroundColor: theme.vars.palette.background.paper,
  boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  ...theme.applyStyles('dark', {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.background} 56%, transparent)`,
    boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.background} 4%, transparent)`,
  }),
  borderRadius: `calc(${theme.vars.shape.borderRadius} - 4px)`,
})

interface SettingsControlProps {
  selected?: boolean
}

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

export const SlippageInput: React.FC<React.ComponentProps<typeof InputBase>> =
  styled(InputBase)(({ theme }) => ({
    minHeight: 44,
    width: '100%',
    backgroundColor: theme.vars.palette.background.default,
    border: '1px solid',
    borderColor: theme.vars.palette.divider,
    borderRadius: theme.vars.shape.borderRadius,
    paddingRight: theme.spacing(1),
    [`.${inputBaseClasses.input}`]: {
      padding: theme.spacing(1.5),
      fontSize: 16,
      fontWeight: 500,
      lineHeight: '20px',
      '&::placeholder': {
        opacity: 1,
        color: theme.vars.palette.text.secondary,
      },
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        display: 'none',
      },
    },
  }))

export const SlippageClearButton: React.FC<
  React.ComponentProps<typeof IconButton>
> = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  flexShrink: 0,
}))
