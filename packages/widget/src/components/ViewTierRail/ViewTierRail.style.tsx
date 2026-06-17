import { styled } from '@mui/material/styles'
import type React from 'react'
import { NavigationTab, NavigationTabs } from '../Tabs/NavigationTabs.js'

export const RailTabs: React.FC<React.ComponentProps<typeof NavigationTabs>> =
  styled(NavigationTabs)(({ theme }) => ({
    minHeight: 'unset',
    maxHeight: 'unset',
    width: 'auto',
    padding: theme.spacing(0.5),
    alignItems: 'center',
    backgroundColor: theme.vars.palette.background.default,
    borderRadius: theme.vars.shape.borderRadiusSecondary,
    border: theme.container?.border,
    boxShadow: theme.container?.boxShadow,
    '& .MuiTabs-indicator': {
      borderRadius: theme.vars.shape.borderRadiusSecondary,
    },
    '& .MuiTabs-flexContainerVertical': {
      gap: theme.spacing(0.5),
    },
  }))

export const RailTab: React.FC<React.ComponentProps<typeof NavigationTab>> =
  styled(NavigationTab)({
    width: 48,
    height: 48,
    minWidth: 48,
    minHeight: 48,
    maxHeight: 48,
    padding: 0,
    '& .MuiSvgIcon-root': {
      fontSize: 24,
      margin: 0,
    },
  })
