import { styled } from '@mui/material'
import type React from 'react'
import { Card } from './Card.js'

export const InputCard: React.FC<React.ComponentProps<typeof Card>> = styled(
  Card,
  {
    name: 'MuiInputCard',
    slot: 'root',
  }
)({})
