import { Box, styled } from '@mui/material'
import { ButtonTertiary } from '../ButtonTertiary.js'

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2, 2, 2),
}))

export const AmountInputButton = styled(ButtonTertiary)(({ theme }) => ({
  padding: theme.spacing(0.75, 1),
  lineHeight: 1,
  fontSize: 12,
  fontWeight: 700,
  minWidth: 'unset',
  height: 'auto',
  flex: 1,
  backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  '&:hover, &:active': {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
  },
  ...theme.applyStyles('dark', {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    '&:hover, &:active': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    },
  }),
}))
