import { Box, cardHeaderClasses, styled } from '@mui/material'
import type React from 'react'
import { CardHeader } from '../Card/CardHeader.js'
import { CardLabel, CardLabelTypography } from '../Card/CardLabel.js'

export const SendToWalletCardTitleRow: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2, 0, 2),
  height: 30,
}))

export const SendToWalletRequiredLabel: React.FC<
  React.ComponentProps<typeof CardLabel>
> = styled(CardLabel)(({ theme }) => ({
  padding: theme.spacing(0, 1),
}))

export const SendToWalletRequiredLabelText: React.FC<
  React.ComponentProps<typeof CardLabelTypography>
> = styled(CardLabelTypography)(({ theme }) => ({
  padding: theme.spacing(0, 0.5),
}))

export const SendToWalletCardHeader: React.FC<
  React.ComponentProps<typeof CardHeader> & { selected?: boolean }
> = styled(CardHeader, {
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
