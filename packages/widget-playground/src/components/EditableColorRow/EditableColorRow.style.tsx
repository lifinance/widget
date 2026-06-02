import { Box, InputBase, inputBaseClasses, styled } from '@mui/material'
import type { FC } from 'react'

export const HexLabel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.secondary,
    fontVariantNumeric: 'tabular-nums',
  })
)

export const ColorSwatch: FC<
  React.ComponentProps<typeof InputBase> & { swatchColor: string }
> = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'swatchColor',
})<{ swatchColor: string }>(({ theme, swatchColor }) => ({
  width: 24,
  height: 24,
  minHeight: 0,
  padding: 0,
  borderRadius: 4,
  backgroundColor: swatchColor,
  border: '1px solid',
  borderColor: theme.vars.palette.divider,
  overflow: 'hidden',
  cursor: 'pointer',
  [`& .${inputBaseClasses.input}`]: {
    width: 24,
    height: 24,
    padding: 0,
    cursor: 'pointer',
    opacity: 0,
  },
  [`& .${inputBaseClasses.input}::-webkit-color-swatch-wrapper`]: {
    padding: 0,
  },
  [`& .${inputBaseClasses.input}::-webkit-color-swatch`]: {
    border: 'none',
  },
  [`& .${inputBaseClasses.input}::-moz-color-swatch`]: {
    border: 'none',
  },
}))
