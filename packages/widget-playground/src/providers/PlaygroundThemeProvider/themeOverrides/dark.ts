import type { WidgetTheme } from '@lifi/widget'
import type { Theme } from '@mui/material'
import { body } from './body'

export const darkPalette = {
  mode: 'dark',
  background: {
    paper: '#212121',
    default: '#121212',
  },
  text: {
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    icon: 'rgba(255, 255, 255, 0.5)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    active: '#fff',
    hover: 'rgba(255, 255, 255, 0.08)',
    hoverOpacity: 0.08,
    selected: 'rgba(255, 255, 255, 0.16)',
    selectedOpacity: 0.16,
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(255, 255, 255, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
  },
}

export const darkComponents = {
  MuiCssBaseline: {
    styleOverrides: (theme: WidgetTheme & Theme) => ({
      body: {
        ...body,
        backgroundColor:
          theme.playground?.background || theme.palette?.common?.black,
      },
    }),
  },
}
