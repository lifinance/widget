import { AppBar, Box, styled, Typography } from '@mui/material'

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.default,
  color: theme.vars.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  minHeight: 48,
  padding: theme.spacing(1, 2),
  paddingTop: theme.spacing(1.5),
}))

export const HeaderControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}))

export const HeaderTitleTypography = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== '$isHomePage' && prop !== '$alignCenter',
})<{ $isHomePage: boolean; $alignCenter: boolean }>(
  ({ $isHomePage, $alignCenter }) => ({
    flex: 1,
    fontWeight: 700,
    fontSize: $isHomePage ? 24 : 18,
    textAlign: $alignCenter ? 'center' : 'left',
  })
)
