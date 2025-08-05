import { styled, tabsClasses } from '@mui/material'
import { Tab as BaseTab, Tabs as BaseTabs } from '../Tabs/Tabs.style.js'

export const Tabs = styled(BaseTabs)(({ theme }) => ({
  width: 'fit-content',
  minHeight: theme.spacing(5),
  maxHeight: theme.spacing(5),
  background: 'transparent',
  ...theme.applyStyles('dark', {
    backgroundColor: 'transparent',
  }),
  [`& .${tabsClasses.scroller}`]: {
    padding: 0,
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

export const Tab = styled(BaseTab)(({ theme }) => ({
  minHeight: theme.spacing(5),
  maxHeight: theme.spacing(5),
}))
