import { styled, tabsClasses } from '@mui/material'
import { Tab as BaseTab, Tabs as BaseTabs } from '../Tabs/Tabs.style.js'

export const Tabs = styled(BaseTabs)(({ theme }) => ({
  width: 'fit-content',
  minHeight: theme.spacing(5),
  background: 'transparent',
  ...theme.applyStyles('dark', {
    backgroundColor: 'transparent',
  }),
  [`& .${tabsClasses.indicator}`]: {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    ...theme.applyStyles('dark', {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    }),
  },
}))

export const Tab = styled(BaseTab)(({ theme }) => ({
  minHeight: theme.spacing(5),
  maxHeight: theme.spacing(5),
  borderRadius: theme.vars.shape.borderRadius,
}))
