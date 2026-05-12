import { Box, Link, styled, Typography } from '@mui/material'
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

const StyledDocsLink: FC<React.ComponentProps<typeof Link>> = styled(Link)(
  ({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
    color: theme.vars.palette.primary.main,
    alignSelf: 'flex-start',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  })
)

export const DocsLink = ({ href }: { href: string }): React.ReactElement => (
  <StyledDocsLink href={href} target="_blank" rel="noopener noreferrer">
    Read docs
  </StyledDocsLink>
)

export const CapitalizeFirstLetter: FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(() => ({
  fontSize: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  color: 'inherit',
  '&::first-letter': {
    textTransform: 'capitalize',
  },
}))
