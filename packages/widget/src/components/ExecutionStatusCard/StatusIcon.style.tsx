import { Box, styled } from '@mui/material'
import type React from 'react'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'

export const StatusIconContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: iconCircleSize,
    height: iconCircleSize,
  })
