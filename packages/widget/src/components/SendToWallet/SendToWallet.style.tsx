import { cardHeaderClasses, styled } from '@mui/material'
import { CardHeader } from '../Card/CardHeader.js'

export const SendToWalletCardHeader = styled(CardHeader, {
  shouldForwardProp: (prop) => !['selected'].includes(prop as string),
})<{ selected?: boolean }>(({ theme }) => ({
  width: '100%',
  [`.${cardHeaderClasses.title}`]: {
    color: theme.vars.palette.text.secondary,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontWeight: 500,
    width: 254,
    [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
      width: 224,
    },
  },
  [`.${cardHeaderClasses.subheader}`]: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 254,
    [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
      width: 224,
    },
  },
  [`.${cardHeaderClasses.action}`]: {
    marginRight: 0,
  },
  [`.${cardHeaderClasses.action} > button`]: {
    fontSize: 16,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        [`.${cardHeaderClasses.title}`]: {
          color: theme.vars.palette.text.primary,
          fontWeight: 600,
          width: 224,
          [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
            width: 192,
          },
        },
        [`.${cardHeaderClasses.subheader}`]: {
          width: 224,
          [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
            width: 192,
          },
        },
      },
    },
  ],
}))
