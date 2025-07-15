import type { CardProps as MuiCardProps } from '@mui/material'
import {
  Box,
  ButtonBase,
  Card as MuiCard,
  styled,
  Typography,
} from '@mui/material'

export interface CardProps extends MuiCardProps {
  type?: 'default' | 'selected' | 'error'
  selectionColor?: 'primary' | 'secondary'
  indented?: boolean
}

export const Card = styled(MuiCard, {
  shouldForwardProp: (prop) =>
    !['type', 'indented', 'selectionColor'].includes(prop as string),
})<CardProps>(({ theme }) => {
  return {
    padding: 0,
    variants: [
      {
        props: ({ indented }) => indented,
        style: {
          padding: theme.spacing(2),
        },
      },
      {
        props: {
          selectionColor: 'primary',
          type: 'selected',
        },
        style: {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.vars.palette.primary.main,
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 5%, white)`,
          '&:hover': {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 10%, white)`,
          },
          ...theme.applyStyles('dark', {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 35%, black)`,
            '&:hover': {
              backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 40%, black)`,
            },
          }),
        },
      },
      {
        props: {
          selectionColor: 'secondary',
          type: 'selected',
        },
        style: {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 20%, white)`,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: `rgba(${theme.vars.palette.secondary.mainChannel} / 0.24)`,
          '&:hover': {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 24%, white)`,
          },
          ...theme.applyStyles('dark', {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 24%, black)`,
            '&:hover': {
              backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 28%, black)`,
            },
          }),
        },
      },
      {
        props: {
          type: 'error',
        },
        style: {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.vars.palette.error.main,
        },
      },
    ],
  }
})

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
  borderRadius: theme.vars.shape.borderRadius,
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
