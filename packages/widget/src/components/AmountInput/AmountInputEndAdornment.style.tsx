import { Box, styled } from '@mui/material'
import { ButtonChip } from '../ButtonChip/ButtonChip.js'

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2, 2, 2),
}))

export const AmountInputButton = styled(ButtonChip)(() => ({
  flex: 1,
}))
