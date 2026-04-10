import { styled, Tabs, tabsClasses } from '@mui/material'
import type React from 'react'
import { Tab } from './Tabs.style.js'

export const NavigationTabs: React.FC<React.ComponentProps<typeof Tabs>> =
  styled(Tabs, {
    name: 'MuiNavigationTabs',
    slot: 'root',
  })(({ theme }) => ({
    overflow: 'visible', // Prevent shadows from being cut off
    width: 'fit-content',
    minHeight: theme.spacing(5),
    maxHeight: theme.spacing(5),
    background: 'transparent',
    ...theme.applyStyles('dark', {
      backgroundColor: 'transparent',
    }),
    [`& .${tabsClasses.scroller}`]: {
      padding: 0,
      overflow: 'visible !important', // Enforce since overflow is set dynamically
    },
    [`& .${tabsClasses.indicator}`]: {
      boxShadow: 'none',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      borderRadius: theme.vars.shape.borderRadius,
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
      ...theme.applyStyles('dark', {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
      }),
    },
  }))

export const NavigationTab: React.FC<React.ComponentProps<typeof Tab>> = styled(
  Tab,
  {
    name: 'MuiNavigationTab',
    slot: 'root',
  }
)(({ theme }) => ({
  minHeight: theme.spacing(5),
  maxHeight: theme.spacing(5),
}))
