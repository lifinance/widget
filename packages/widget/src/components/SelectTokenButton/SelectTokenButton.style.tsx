import {
  cardHeaderClasses,
  CardContent as MuiCardContent,
  styled,
} from '@mui/material'
import type { FormType } from '../../stores/form/types.js'
import { Card } from '../Card/Card.js'
import { CardHeader } from '../Card/CardHeader.js'

const truncate = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  width: 96,
}

export const SelectTokenCardHeader = styled(CardHeader, {
  shouldForwardProp: (prop) => !['selected'].includes(prop as string),
})<{ selected?: boolean }>(({ theme }) => ({
  padding: theme.spacing(2),
  [`.${cardHeaderClasses.title}`]: {
    ...truncate,
    color: theme.vars.palette.text.secondary,
    fontSize: 16,
    fontWeight: 500,
  },
  [`.${cardHeaderClasses.subheader}`]: {
    ...truncate,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        [`.${cardHeaderClasses.title}`]: {
          color: theme.vars.palette.text.primary,
          fontSize: 18,
          fontWeight: 600,
        },
      },
    },
  ],
}))

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
  shouldForwardProp: (prop) => !['formType', 'mask'].includes(prop as string),
})<{ formType: FormType; mask?: boolean }>(
  ({ theme, formType, mask = true }) => {
    const cardVariant = theme.components?.MuiCard?.defaultProps?.variant
    const horizontal = formType === 'to' ? '-8px' : 'calc(100% + 8px)'
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
          ? `radial-gradient(circle 20px at ${horizontal} 50%, #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`
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
