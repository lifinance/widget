import {
  cardHeaderClasses,
  CardHeader as MuiCardHeader,
  styled,
} from '@mui/material'
import type React from 'react'

export const CardHeader: React.FC<React.ComponentProps<typeof MuiCardHeader>> =
  styled(MuiCardHeader)(({ theme }) => ({
    [`.${cardHeaderClasses.action}`]: {
      marginTop: -2,
      alignSelf: 'center',
    },
    [`.${cardHeaderClasses.title}`]: {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: 1.3334,
      color: theme.vars.palette.text.primary,
      textAlign: 'left',
    },
    [`.${cardHeaderClasses.subheader}`]: {
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.3334,
      color: theme.vars.palette.text.secondary,
      textAlign: 'left',
    },
  }))
