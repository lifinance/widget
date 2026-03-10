import { Box, styled } from '@mui/material'
import { ButtonTertiary } from '../ButtonTertiary.js'

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}))

export const PercentagePill = styled(ButtonTertiary)(({ theme }) => ({
  padding: theme.spacing(1, 0.75),
  lineHeight: 1.3333,
  fontSize: '0.75rem',
  fontWeight: 700,
  minWidth: 'unset',
  height: 'auto',
  flex: 1,
  borderRadius: 12,
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
