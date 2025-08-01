import { styled } from '@mui/material'
import { Tab as BaseTab, Tabs as BaseTabs } from '../Tabs/Tabs.style.js'

export const Tabs = styled(BaseTabs)(({ theme }) => ({
  minHeight: theme.spacing(4),
}))

export const Tab = styled(BaseTab)(({ theme }) => ({
  minHeight: theme.spacing(4),
  maxHeight: theme.spacing(4),
}))
