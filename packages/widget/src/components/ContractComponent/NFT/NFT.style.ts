import { Avatar, styled } from '@mui/material'
import type React from 'react'

export const PreviewAvatar: React.FC<React.ComponentProps<typeof Avatar>> =
  styled(Avatar)(({ theme }) => ({
    background: theme.vars.palette.background.paper,
    width: 96,
    height: 96,
    borderRadius: theme.vars.shape.borderRadius,
  }))
