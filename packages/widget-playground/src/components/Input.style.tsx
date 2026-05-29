import { InputBase, inputBaseClasses, styled } from '@mui/material'
import type { FC } from 'react'

export const ValueInput: FC<React.ComponentProps<typeof InputBase>> = styled(
  InputBase
)(({ theme }) => ({
  [`& .${inputBaseClasses.input}`]: {
    padding: 0,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.secondary,
    fontVariantNumeric: 'tabular-nums',
    '&:focus': {
      color: theme.vars.palette.text.primary,
    },
  },
}))
