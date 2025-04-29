import { Box, styled } from '@mui/material'

export const ResetButtonContainer = styled(Box)(({ theme }) => ({
  background: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  borderRadius: '16px',
  padding: '16px',
  svg: {
    fill: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.4)`,
  },
}))
