import { Button, buttonClasses, styled } from '@mui/material'
import { getContrastAlphaColor } from '../utils/colors.js'

export const ButtonTertiary = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  height: 40,
  fontSize: 14,
  backgroundColor: getContrastAlphaColor(theme, 0.04),
  '&:hover, &:active': {
    backgroundColor: getContrastAlphaColor(theme, 0.08),
  },
  [`&.${buttonClasses.loading}:disabled`]: {
    backgroundColor: getContrastAlphaColor(theme, 0.04),
  },
  [`.${buttonClasses.loadingIndicator}`]: {
    color: theme.palette.text.primary,
  },
}))
