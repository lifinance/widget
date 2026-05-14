import {
  Box,
  InputBase,
  inputBaseClasses,
  Slider,
  sliderClasses,
  styled,
} from '@mui/material'
import type { FC } from 'react'

export const SliderRow: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: 0,
    marginTop: theme.spacing(2),
  })
)

export const ThemeSlider: FC<React.ComponentProps<typeof Slider>> = styled(
  Slider
)(({ theme }) => ({
  width: 156,
  flexShrink: 0,
  [`& .${sliderClasses.rail}`]: {
    height: 4,
    borderRadius: 4,
    backgroundColor: theme.vars.palette.divider,
    opacity: 1,
  },
  [`& .${sliderClasses.track}`]: {
    height: 4,
    borderRadius: 4,
    backgroundColor: theme.vars.palette.primary.main,
    border: 'none',
  },
  [`& .${sliderClasses.thumb}`]: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    border: '1px solid',
    borderColor: theme.vars.palette.divider,
    boxShadow: 'none',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 4px rgba(92, 103, 255, 0.16)',
    },
    '&::before': {
      display: 'none',
    },
  },
}))

export const SliderValueInput: FC<React.ComponentProps<typeof InputBase>> =
  styled(InputBase)(({ theme }) => ({
    width: 48,
    flexShrink: 0,
    padding: theme.spacing(0.75, 1),
    borderRadius: 8,
    border: '1px solid',
    borderColor: theme.vars.palette.divider,
    transition: 'border-color 0.15s',
    '&:focus-within': {
      borderColor: theme.vars.palette.primary.main,
    },
    [`& .${inputBaseClasses.input}`]: {
      padding: 0,
      textAlign: 'right',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '20px',
      color: theme.vars.palette.text.primary,
      fontVariantNumeric: 'tabular-nums',
    },
  }))
