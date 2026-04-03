import { Container as MuiContainer, styled } from '@mui/material'
import type React from 'react'

export const Container: React.FC<React.ComponentProps<typeof MuiContainer>> =
  styled(MuiContainer)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: theme.spacing(2),
  }))
