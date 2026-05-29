import { Box, styled } from '@mui/material'
import type { FC } from 'react'

export const ThemeSections: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  })
)

export const ColorRowStack: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  })
)

export const FontFieldStack: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  })
)
