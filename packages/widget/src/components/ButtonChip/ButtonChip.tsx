import { styled } from '@mui/material'
import { ButtonTertiary } from '../ButtonTertiary.js'

export const ButtonChip = styled(ButtonTertiary)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3334,
  height: 'auto',
}))
