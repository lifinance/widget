import { Box, styled, Typography } from '@mui/material'
import { AvatarMasked } from '../Avatar/Avatar.style.js'

export const StepLabelTypography = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.3334,
  color: theme.vars.palette.text.primary,
  whiteSpace: 'nowrap',
}))

export const StepAvatar = styled(AvatarMasked)(({ theme }) => ({
  color: theme.vars.palette.text.primary,
  backgroundColor: 'transparent',
}))

export const StepActionsHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

export const StepActionsTitle = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 700,
}))
