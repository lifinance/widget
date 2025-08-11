import { styled, Tabs, tabsClasses } from '@mui/material'
import { Tab } from './Tabs.style.js'

export const NavigationTabs = styled(Tabs, {
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
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    ...theme.applyStyles('dark', {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    }),
  },
}))

export const NavigationTab = styled(Tab, {
  name: 'MuiNavigationTab',
  slot: 'root',
})(({ theme }) => ({
  minHeight: theme.spacing(5),
  maxHeight: theme.spacing(5),
}))
