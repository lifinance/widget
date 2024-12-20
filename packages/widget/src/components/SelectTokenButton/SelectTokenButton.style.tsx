import {
  CardContent as MuiCardContent,
  cardHeaderClasses,
  darken,
  lighten,
  styled,
} from '@mui/material'
import type { FormType } from '../../stores/form/types.js'
import { Card } from '../Card/Card.js'
import { CardHeader } from '../Card/CardHeader.js'

export const SelectTokenCardHeader = styled(CardHeader, {
  shouldForwardProp: (prop) =>
    !['selected', 'compact'].includes(prop as string),
})<{ selected?: boolean; compact?: boolean }>(
  ({ theme, selected, compact }) => ({
    padding: theme.spacing(2),
    [`.${cardHeaderClasses.title}`]: {
      color: theme.palette.text.secondary,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: 256,
      fontSize: compact && !selected ? 16 : 18,
      fontWeight: 500,
      [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
        width: 224,
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
    },
    variants: [
      {
        props: ({ selected }) => selected,
        style: {
          [`.${cardHeaderClasses.title}`]: {
            color: theme.palette.text.primary,
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

export const SelectTokenCard = styled(Card)(({ theme }) => {
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

export const CardContent = styled(MuiCardContent, {
  shouldForwardProp: (prop) => prop !== 'formType' && prop !== 'compact',
})<{ formType: FormType; compact: boolean }>(({ theme, formType, compact }) => {
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
      backgroundColor: theme.palette.background.paper,
      mask: `radial-gradient(circle 20px at ${horizontal} ${vertical}, #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`,
    }),
    ...(cardVariant === 'filled' && {
      '&:hover': {
        cursor: 'pointer',
        backgroundColor:
          theme.palette.mode === 'light'
            ? darken(theme.palette.background.paper, 0.02)
            : lighten(theme.palette.background.paper, 0.02),
      },
    }),
  }
})
