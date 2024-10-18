import type { TabProps } from '@mui/material'
import {
  Tab as MuiTab,
  Tabs as MuiTabs,
  alpha,
  styled,
  tabClasses,
  tabsClasses,
} from '@mui/material'

export const Tabs = styled(MuiTabs)(({ theme }) => ({
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

export const CardTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.04)
      : alpha(theme.palette.common.white, 0.08),
  [`.${tabsClasses.indicator}`]: {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : alpha(theme.palette.common.black, 0.56),
  },
}))

export const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  zIndex: 1,
  flex: 1,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white,
  [`&.${tabClasses.selected}`]: {
    color:
      theme.palette.mode === 'light'
        ? theme.palette.common.black
        : theme.palette.common.white,
  },
}))
