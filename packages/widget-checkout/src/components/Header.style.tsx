import { AppBar, Box, styled, Typography } from '@mui/material'

export const HeaderAppBar: React.FC<React.ComponentProps<typeof AppBar>> =
  styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.vars.palette.background.default,
    color: theme.vars.palette.text.primary,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    minHeight: 56,
    padding: theme.spacing(1.5, 3),
    marginBottom: theme.spacing(1.5),
  }))

export const HeaderControlsContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}))

export const HeaderTitleTypography: React.FC<
  React.ComponentProps<typeof Typography> & {
    $isHomePage: boolean
    $alignCenter: boolean
  }
> = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== '$isHomePage' && prop !== '$alignCenter',
})<{ $isHomePage: boolean; $alignCenter: boolean }>(
  ({ $isHomePage, $alignCenter }) => ({
    flex: 1,
    fontWeight: 700,
    fontSize: 18,
    lineHeight: $isHomePage ? '24px' : undefined,
    textAlign: $alignCenter ? 'center' : 'left',
  })
)
