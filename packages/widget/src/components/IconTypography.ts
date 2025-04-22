import { Box, styled } from '@mui/material'

export const IconTypography = styled(Box)(({ theme }) => ({
  color: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.4)`,
  lineHeight: 0,
  ...theme.applyStyles('dark', {
    color: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.32)`,
  }),
}))
