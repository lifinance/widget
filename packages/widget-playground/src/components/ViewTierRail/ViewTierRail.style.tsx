import { Tab, Tabs } from '@mui/material'
import { styled } from '@mui/material/styles'
import type React from 'react'

export const RailTabs: React.FC<React.ComponentProps<typeof Tabs>> = styled(
  Tabs
)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.5),
  borderRadius: 16,
  backgroundColor: theme.vars.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.grey[900],
  }),
  '& .MuiTabs-indicator': {
    width: '100%',
    left: 0,
    borderRadius: 12,
    backgroundColor: theme.vars.palette.common.white,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
    ...theme.applyStyles('dark', {
      backgroundColor: theme.vars.palette.grey[800],
    }),
  },
  '& .MuiTabs-scroller': {
    overflow: 'visible !important',
  },
  '& .MuiTabs-flexContainerVertical': {
    gap: theme.spacing(0.5),
  },
}))

export const RailTab: React.FC<React.ComponentProps<typeof Tab>> = styled(Tab)(
  ({ theme }) => ({
    minWidth: 'auto',
    minHeight: 'auto',
    padding: theme.spacing(1.5),
    borderRadius: 12,
    color: theme.vars.palette.text.secondary,
    zIndex: 1,
    '&.Mui-selected': {
      color: theme.vars.palette.text.primary,
    },
    '& .MuiSvgIcon-root': {
      fontSize: 28,
    },
  })
)
