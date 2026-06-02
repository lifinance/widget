import {
  Box,
  IconButton,
  InputBase,
  inputBaseClasses,
  styled,
} from '@mui/material'
import type { ComponentProps, FC } from 'react'

export const HeightControlRoot: FC<ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  })
)

export const HeightControlLabel: FC<ComponentProps<'label'>> = styled('label')({
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '18px',
})

export const HeightControlRow: FC<ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
  })
)

export const HeightControlInput: FC<ComponentProps<typeof InputBase>> = styled(
  InputBase
)(({ theme }) => ({
  minHeight: 44,
  width: '100%',
  flex: '1 0 0',
  backgroundColor: theme.vars.palette.background.default,
  border: '1px solid',
  borderColor: theme.vars.palette.divider,
  borderRadius: '12px',
  boxShadow: 'none',
  [`.${inputBaseClasses.input}`]: {
    minHeight: 'auto',
    width: '100%',
    textAlign: 'left',
    padding: theme.spacing(1.5),
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '20px',
    '&::placeholder': {
      opacity: 1,
      color: theme.vars.palette.text.secondary,
    },
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      display: 'none',
    },
  },
}))

export const ClearHeightButton: FC<ComponentProps<typeof IconButton>> = styled(
  IconButton
)({
  padding: '4px',
  flexShrink: 0,
  color: 'text.primary',
})

export const HeightHelperText: FC<ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '16px',
    color: theme.vars.palette.text.secondary,
  })
)
