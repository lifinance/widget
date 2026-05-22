import { Box, styled } from '@mui/material'
import type { ComponentProps, FC } from 'react'

export const MockElement: FC<ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    backgroundColor: theme.vars.palette.background.paper,
    width: '100%',
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })
)
