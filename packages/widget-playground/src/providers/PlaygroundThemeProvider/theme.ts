import type { WidgetTheme } from '@lifi/widget'
import { createTheme } from '@mui/material'

const initValues: WidgetTheme = {
  palette: {
    primary: {
      main: '#5C67FF',
    },
    secondary: {
      main: '#F5B5FF',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 12,
    borderRadiusSecondary: 12,
    borderRadiusTertiary: 24,
  },
}

export const theme = createTheme(initValues)
