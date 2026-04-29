import {
  Box,
  InputBase,
  inputBaseClasses,
  Slider,
  sliderClasses,
  styled,
} from '@mui/material'
import type { FC } from 'react'

export const Content: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  flex: '1 0 0',
  minHeight: 0,
  overflowY: 'auto',
  padding: '24px 20px',
})

export const PageTitle: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '32px',
    color: theme.vars.palette.text.primary,
    marginBottom: 8,
  })
)

export const PageDescription: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '24px',
  color: theme.vars.palette.text.secondary,
  marginBottom: 24,
}))

export const SectionHeading: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 18,
    fontWeight: 700,
    lineHeight: '20px',
    color: theme.vars.palette.text.primary,
    marginTop: 24,
    marginBottom: 24,
    '&:first-of-type': {
      marginTop: 0,
    },
  })
)

export const Row: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: 12,
    borderRadius: 12,
    border: '1px solid',
    borderColor: theme.vars.palette.divider,
    backgroundColor: theme.vars.palette.background.paper,
    transition: 'border-color 0.15s',
    '&:hover': {
      borderColor: 'rgba(0,0,0,0.24)',
    },
    '&:focus-within': {
      borderColor: theme.vars.palette.primary.main,
    },
    '& + &': {
      marginTop: 16,
    },
  })
)

export const RowLabel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
    color: theme.vars.palette.text.secondary,
    flex: '1 0 0',
    minWidth: 0,
  })
)

export const RowValue: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 12,
  flexShrink: 0,
})

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
})<{ swatchColor: string }>(({ swatchColor }) => ({
  width: 24,
  height: 24,
  minHeight: 0,
  padding: 0,
  borderRadius: 4,
  backgroundColor: swatchColor,
  border: '1px solid rgba(0,0,0,0.08)',
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

export const ToggleRow: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  marginTop: 16,
})

export const ToggleRowLabel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '18px',
    color: theme.vars.palette.text.primary,
    flex: '1 0 0',
    minWidth: 0,
  })
)

export const SliderRow: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: 0,
  marginTop: 16,
})

export const ThemeSlider: FC<React.ComponentProps<typeof Slider>> = styled(
  Slider
)(({ theme }) => ({
  width: 156,
  flexShrink: 0,
  [`& .${sliderClasses.rail}`]: {
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.12)',
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
    borderColor: 'rgba(0,0,0,0.24)',
    boxShadow: 'none',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0 0 0 4px rgba(92, 103, 255, 0.16)`,
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
    padding: '6px 12px',
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

export const SubSection: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  paddingLeft: 0,
  paddingTop: 12,
  paddingBottom: 4,
})

export const SubRow: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '8px 0',
})

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
