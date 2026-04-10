import type { TabProps } from '@mui/material'
import {
  Tab as MuiTab,
  Tabs as MuiTabs,
  tabClasses,
  tabsClasses,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import type React from 'react'
import { getCardFieldsetBackgroundColor } from '../../utils/color.js'

export const Tabs: React.FC<React.ComponentProps<typeof MuiTabs>> = styled(
  MuiTabs
)(({ theme }) => ({
  ...getCardFieldsetBackgroundColor(theme),
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary
  ),
  padding: theme.spacing(0.5),
  flex: 1,
  [`.${tabsClasses.indicator}`]: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.vars.palette.common.white,
    borderRadius:
      Math.max(theme.shape.borderRadius, theme.shape.borderRadiusSecondary) - 4,
    boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.vars.palette.background.default,
      boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.background} 4%, transparent)`,
    }),
  },
}))

export const Tab: React.FC<React.ComponentProps<typeof MuiTab>> = styled(
  MuiTab,
  {
    shouldForwardProp: (prop) => prop !== 'isDarkMode',
  }
)<TabProps>(({ theme }) => ({
  zIndex: 1,
  flex: 1,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  minHeight: 48,
  color: theme.vars.palette.common.onBackground,
  [`&.${tabClasses.selected}`]: {
    color: theme.vars.palette.common.onBackground,
  },
}))
