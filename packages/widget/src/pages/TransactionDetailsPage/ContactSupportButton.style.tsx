import { styled } from '@mui/material'
import type React from 'react'
import { ButtonTertiary } from '../../components/ButtonTertiary.js'

export const ButtonChip: React.FC<React.ComponentProps<typeof ButtonTertiary>> =
  styled(ButtonTertiary)(({ theme }) => ({
    padding: theme.spacing(0.5, 1.5),
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.3334,
    height: 'auto',
  }))
