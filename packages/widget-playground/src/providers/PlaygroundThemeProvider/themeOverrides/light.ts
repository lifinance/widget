import type { WidgetTheme } from '@lifi/widget'
import { body } from './body'

export const lightPalette = {
  mode: 'light',
  text: {
    primary: '#000000',
    secondary: '#747474',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
}

// TODO: look at moving the Baseline to the central theme?
export const lightComponents = {
  MuiCssBaseline: {
    styleOverrides: (theme: WidgetTheme) => ({
      body: {
        ...body,
        backgroundColor:
          theme.playground?.background || theme.palette?.grey?.[100],
      },
    }),
  },
}
