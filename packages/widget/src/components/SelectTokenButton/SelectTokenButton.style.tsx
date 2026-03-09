import {
  Box,
  CardContent as MuiCardContent,
  styled,
  Typography,
} from '@mui/material'
import type { FormType } from '../../stores/form/types.js'
import { Card } from '../Card/Card.js'

export const SelectTokenCard = styled(Card)(({ theme }) => {
  const cardVariant = theme.components?.MuiCard?.defaultProps?.variant
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    ...(cardVariant !== 'outlined' && {
      background: 'none',
      '&:hover': {
        cursor: 'pointer',
        background: 'none',
      },
    }),
  }
})

export const CardContent = styled(MuiCardContent, {
  shouldForwardProp: (prop) =>
    !['formType', 'compact', 'mask'].includes(prop as string),
})<{ formType: FormType; compact: boolean; mask?: boolean }>(
  ({ theme, formType, compact, mask = true }) => {
    const cardVariant = theme.components?.MuiCard?.defaultProps?.variant
    const direction = formType === 'to' ? '-8px' : 'calc(100% + 8px)'
    const horizontal = compact ? direction : '50%'
    const vertical = compact ? '50%' : direction
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1.5),
      padding: theme.spacing(3),
      flex: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.easeOut,
      }),
      '&:last-child': {
        paddingBottom: theme.spacing(3),
      },
      ...(cardVariant !== 'outlined' && {
        backgroundColor: theme.vars.palette.background.paper,
        mask: mask
          ? `radial-gradient(circle 20px at ${horizontal} ${vertical}, #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`
          : 'none',
      }),
      ...(cardVariant === 'filled' && {
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 98%, black)`,
          ...theme.applyStyles('dark', {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 98%, white)`,
          }),
        },
      }),
    }
  }
)

export const AvatarItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}))

export const TokenLabelColumn = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: 1,
}))

export const TokenNameText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.3333,
  color: selected
    ? theme.vars.palette.text.primary
    : theme.vars.palette.text.secondary,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}))

export const ChainNameText = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.2857,
  color: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.48)`,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}))
