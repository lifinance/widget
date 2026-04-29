import { Box, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const LogoContainer: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flex: '1 0 0',
  minWidth: 0,
})

export const HorizontalLogo: FC<React.ComponentProps<'svg'>> = styled('svg')(
  ({ theme }) => ({
    display: 'block',
    height: 24,
    width: 'auto',
    maxWidth: '100%',
    color: theme.vars.palette.text.primary,
    marginTop: -1,
  })
)

export const BrandSuffix: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
  flexShrink: 0,
}))
