import { Box, badgeClasses, Badge as MuiBadge, styled } from '@mui/material'
import type React from 'react'

export const SettingsList: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

export const Badge: React.FC<React.ComponentProps<typeof MuiBadge>> = styled(
  MuiBadge
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  [`.${badgeClasses.badge}`]: {
    width: 10,
    height: 10,
    // the following removes MUI styling so we can position the badge with flex
    position: 'relative',
    transform: 'translateX(0)',
    borderRadius: '50%',
  },
}))
