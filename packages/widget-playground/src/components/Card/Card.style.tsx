import type { BoxProps, Theme } from '@mui/material'
import { Box, ButtonBase, Typography } from '@mui/material'
import { alpha, darken, lighten, styled } from '@mui/material/styles'
import type { MouseEventHandler } from 'react'

type CardVariant = 'default' | 'selected' | 'error'

export type CardProps = {
  variant?: CardVariant
  selectionColor?: 'primary' | 'secondary'
  indented?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
} & BoxProps

const getBackgroundColor = (
  theme: Theme,
  variant?: CardVariant,
  selectionColor?: 'primary' | 'secondary'
) =>
  variant === 'selected'
    ? selectionColor === 'primary'
      ? theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.04)
        : alpha(theme.palette.primary.main, 0.42)
      : alpha(
          theme.palette.secondary.main,
          theme.palette.mode === 'light' ? 0.08 : 0.12
        )
    : theme.palette.background.paper

export const Card = styled(Box, {
  shouldForwardProp: (prop) =>
    !['variant', 'indented', 'selectionColor'].includes(prop as string),
})<CardProps>(
  ({ theme, variant, selectionColor = 'primary', indented, onClick }) => {
    const backgroundColor = getBackgroundColor(theme, variant, selectionColor)
    const backgroundHoverColor = onClick
      ? theme.palette.mode === 'light'
        ? darken(backgroundColor, 0.02)
        : lighten(backgroundColor, 0.02)
      : backgroundColor
    return {
      backgroundColor,
      border: '1px solid',
      borderColor:
        variant === 'error'
          ? theme.palette.error.main
          : variant === 'selected'
            ? selectionColor === 'primary'
              ? theme.palette.primary.main
              : alpha(theme.palette.secondary.main, 0.48)
            : theme.palette.mode === 'light'
              ? theme.palette.grey[300]
              : theme.palette.grey[800],
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      position: 'relative',
      padding: indented ? theme.spacing(2) : 0,
      boxSizing: 'border-box',
      '&:hover': {
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: backgroundHoverColor,
      },
      transition: theme.transitions.create(['background-color'], {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.easeOut,
      }),
    }
  }
)

export const CardRowButton = styled(ButtonBase)(({ theme }) => ({
  background: 'none',
  color: 'inherit',
  border: 'none',
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}))

export const CardRowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
}))

export const CardRowColumn = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
}))

export const CardValue = styled(Typography)({
  lineHeight: '1.25',
  fontWeight: 500,
})

export const CardTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  minHeight: 24,
}))
