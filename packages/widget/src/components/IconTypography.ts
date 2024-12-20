import { Box, alpha, styled } from '@mui/material'

export const IconTypography = styled(Box)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.4),
  lineHeight: 0,
  ...theme.applyStyles('light', {
    color: alpha(theme.palette.common.black, 0.32),
  }),
}))
