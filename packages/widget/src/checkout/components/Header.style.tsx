import { AppBar, Box, styled, Typography } from '@mui/material'

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.vars.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  minHeight: 48,
  padding: theme.spacing(1, 2),
  paddingTop: theme.spacing(1.5),
}))

export const HeaderControlsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

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
