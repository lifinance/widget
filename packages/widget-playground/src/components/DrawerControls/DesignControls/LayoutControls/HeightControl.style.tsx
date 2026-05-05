import { InputBase, inputBaseClasses, styled } from '@mui/material'
import type { FC } from 'react'
import { getCardFieldsetBackgroundColor } from '../../../../utils/color.js'

export const Input: FC<React.ComponentProps<typeof InputBase>> = styled(
  InputBase
)(({ theme }) => ({
  minHeight: 56,
  width: '100%',
  [`.${inputBaseClasses.input}`]: {
    minHeight: 56,
    width: '100%',
    padding: 0,
    textAlign: 'center',
    '&::placeholder': {
      fontSize: '1rem',
      fontWeight: 400,
      opacity: 0.5,
    },
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
  ...getCardFieldsetBackgroundColor(theme),
  borderRadius: theme.vars.shape.borderRadiusSecondary,
  boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  ...theme.applyStyles('dark', {
    boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.background} 4%, transparent)`,
  }),
}))
