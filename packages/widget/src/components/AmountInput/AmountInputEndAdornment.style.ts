import { Box, styled } from '@mui/material'
import { ButtonTertiary } from '../ButtonTertiary.js'

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2, 2, 2),
}))

export const AmountInputButton = styled(ButtonTertiary)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0.5, 1.5),
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3334,
  height: 'auto',
  borderRadius: theme.shape.borderRadiusSecondary,
}))
