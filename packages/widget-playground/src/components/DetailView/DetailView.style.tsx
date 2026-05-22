import { Box, Divider, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const Content: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    flex: '1 0 0',
    minHeight: 0,
    overflowY: 'auto',
    padding: theme.spacing(3, 2.5),
  })
)

export const TitleSection: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
  })
)

export const Title: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 700,
  lineHeight: '32px',
  margin: 0,
  color: theme.vars.palette.text.primary,
}))

export const Description: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '24px',
  margin: 0,
  color: theme.vars.palette.text.secondary,
}))

export const CardsContainer: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  })
)

export const SectionHeading: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 18,
    fontWeight: 700,
    lineHeight: '20px',
    color: theme.vars.palette.text.primary,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    '&:first-of-type': {
      marginTop: 0,
    },
  })
)

export const HelperText: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '16px',
    color: theme.vars.palette.text.secondary,
  })
)

export const SectionDivider: FC<React.ComponentProps<typeof Divider>> = styled(
  Divider
)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
}))
