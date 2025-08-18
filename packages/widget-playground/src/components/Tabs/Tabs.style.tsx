import type { TabProps } from '@mui/material'
import {
  Tab as MuiTab,
  Tabs as MuiTabs,
  tabClasses,
  tabsClasses,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { getCardFieldsetBackgroundColor } from '../../utils/color.js'

export const Tabs = styled(MuiTabs)(({ theme }) => ({
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
    boxShadow: `0px 2px 4px rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.vars.palette.background.default,
      boxShadow: `0px 2px 4px rgba(${theme.vars.palette.common.backgroundChannel} / 0.04)`,
    }),
  },
}))

export const Tab = styled(MuiTab, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<TabProps>(({ theme }) => ({
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
