import type { TabProps } from '@mui/material'
import {
  Tab as MuiTab,
  Tabs as MuiTabs,
  styled,
  tabClasses,
  tabsClasses,
} from '@mui/material'
import type React from 'react'

const Tabs = styled(MuiTabs)(({ theme }) => ({
  flex: 1,
  [`.${tabsClasses.indicator}`]: {
    top: theme.spacing(0.5),
    left: theme.spacing(0.5),
    height: `calc(100% - ${theme.spacing(1)})`,
    width: `calc(100% - ${theme.spacing(1)})`,
  },
  [`.${tabsClasses.fixed}`]: {
    padding: theme.spacing(0.5),
  },
}))

export const CardTabs: React.FC<React.ComponentProps<typeof MuiTabs>> = styled(
  Tabs
)(({ theme }) => ({
  backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  [`.${tabsClasses.indicator}`]: {
    backgroundColor: theme.vars.palette.background.paper,
  },
  ...theme.applyStyles('dark', {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    [`.${tabsClasses.indicator}`]: {
      backgroundColor: `rgba(${theme.vars.palette.common.backgroundChannel} / 0.56)`,
    },
  }),
}))

export const Tab: React.FC<React.ComponentProps<typeof MuiTab>> = styled(
  MuiTab
)<TabProps>(({ theme }) => ({
  zIndex: 1,
  flex: 1,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  color: theme.vars.palette.common.onBackground,
  [`&.${tabClasses.selected}`]: {
    color: theme.vars.palette.common.onBackground,
  },
}))
