import type { Theme } from '@mui/material'
import {
  Box,
  ButtonBase,
  InputBase,
  inputBaseClasses,
  styled,
} from '@mui/material'

export const SettingsFieldSet = styled(Box)(({ theme }) => ({
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

const slippageControlSelected = (theme: Theme) => ({
  backgroundColor: theme.vars.palette.background.paper,
  boxShadow: `0px 2px 4px rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  ...theme.applyStyles('dark', {
    backgroundColor: `rgba(${theme.vars.palette.common.backgroundChannel} / 0.56)`,
    boxShadow: `0px 2px 4px rgba(${theme.vars.palette.common.backgroundChannel} / 0.04)`,
  }),
  borderRadius: `calc(${theme.vars.shape.borderRadius} - 4px)`,
})

interface SlippageDefaultProps {
  selected?: boolean
}

export const SlippageDefaultButton = styled(ButtonBase)<SlippageDefaultProps>(
  ({ theme, selected }) => {
    const slippageControlSelectedStyles = slippageControlSelected(theme)
    const selectedStyle = selected
      ? {
          '&:not(:focus)': {
            ...slippageControlSelectedStyles,
          },
        }
      : {}

    return {
      height: '100%',
      width: '100%',
      fontSize: '1rem',
      fontWeight: 700,
      '&:focus': {
        ...slippageControlSelectedStyles,
      },
      ...selectedStyle,
    }
  }
)

export const SlippageCustomInput = styled(InputBase)<SlippageDefaultProps>(
  ({ theme, selected }) => {
    const slippageControlSelectedStyles = slippageControlSelected(theme)
    const selectedStyle = selected
      ? {
          '&:not(:focus)': {
            ...slippageControlSelectedStyles,
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
          ...slippageControlSelectedStyles,
        },
        ...selectedStyle,
      },
    }
  }
)

export const SlippageLimitsWarningContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.25),
  marginTop: theme.spacing(1.5),
}))
