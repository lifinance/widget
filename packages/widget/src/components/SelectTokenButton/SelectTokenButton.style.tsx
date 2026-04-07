import {
  cardHeaderClasses,
  CardContent as MuiCardContent,
  styled,
} from '@mui/material'
import type React from 'react'
import type { FormType } from '../../stores/form/types.js'
import { Card } from '../Card/Card.js'
import { CardHeader } from '../Card/CardHeader.js'

export const SelectTokenCardHeader: React.FC<
  React.ComponentProps<typeof CardHeader> & {
    selected?: boolean
    compact?: boolean
  }
> = styled(CardHeader, {
  shouldForwardProp: (prop) =>
    !['selected', 'compact'].includes(prop as string),
})<{ selected?: boolean; compact?: boolean }>(
  ({ theme, selected, compact }) => ({
    padding: theme.spacing(2),
    [`.${cardHeaderClasses.title}`]: {
      color: theme.vars.palette.text.secondary,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: 256,
      fontSize: compact && !selected ? 16 : 18,
      fontWeight: 500,
      [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
        width: 224,
      },
      [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
        width: 180,
        fontSize: 16,
      },
    },
    [`.${cardHeaderClasses.subheader}`]: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: 256,
      [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
        width: 224,
      },
      [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
        width: 180,
      },
    },
    variants: [
      {
        props: ({ selected }) => selected,
        style: {
          [`.${cardHeaderClasses.title}`]: {
            color: theme.vars.palette.text.primary,
            fontWeight: 600,
          },
        },
      },
      {
        props: ({ compact }) => compact,
        style: {
          [`.${cardHeaderClasses.title}`]: {
            width: 96,
            [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
              width: 96,
            },
          },
          [`.${cardHeaderClasses.subheader}`]: {
            width: 96,
            [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
              width: 96,
            },
          },
        },
      },
    ],
  })
)

export const SelectTokenCard: React.FC<
  React.ComponentProps<typeof Card> & {
    formType?: FormType
    compact?: boolean
    mask?: boolean
  }
> = styled(Card)(({ theme }) => {
  const cardVariant = theme.components?.MuiCard?.defaultProps?.variant
  return {
    flex: 1,
    ...(cardVariant !== 'outlined' && {
      background: 'none',
      '&:hover': {
        cursor: 'pointer',
        background: 'none',
      },
    }),
  }
})

export const CardContent: React.FC<
  React.ComponentProps<typeof MuiCardContent> & {
    formType?: FormType
    compact?: boolean
    mask?: boolean
  }
> = styled(MuiCardContent, {
  shouldForwardProp: (prop) =>
    !['formType', 'compact', 'mask'].includes(prop as string),
})<{ formType?: FormType; compact?: boolean; mask?: boolean }>(
  ({ theme, formType, compact, mask = true }) => {
    const cardVariant = theme.components?.MuiCard?.defaultProps?.variant
    const direction = formType === 'to' ? '-8px' : 'calc(100% + 8px)'
    const horizontal = compact ? direction : '50%'
    const vertical = compact ? '50%' : direction
    return {
      padding: 0,
      transition: theme.transitions.create(['background-color'], {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.easeOut,
      }),
      '&:last-child': {
        paddingBottom: 0,
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
