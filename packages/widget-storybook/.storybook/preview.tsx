import { SDKClientProvider } from '@lifi/widget/src/providers/SDKClientProvider'
import { WidgetProvider } from '@lifi/widget/src/providers/WidgetProvider/WidgetProvider'
import { SettingsStoreProvider } from '@lifi/widget/src/stores/settings/SettingsStore'
import {
  palette,
  paletteDark,
  paletteLight,
} from '@lifi/widget/src/themes/palettes'
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import type { Decorator, Preview } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLayoutEffect } from 'react'

// Initialize i18n with widget translations (must run before components mount)
import './i18n'

const widgetConfig = { integrator: 'lifi-storybook' }

const theme = createTheme({
  cssVariables: {
    cssVarPrefix: 'lifi',
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: { palette: { ...palette, ...paletteLight } },
    dark: { palette: { ...palette, ...paletteDark } },
  },
  shape: {
    borderRadius: 12,
    borderRadiusSecondary: 12,
    borderRadiusTertiary: 24,
  },
  typography: { fontFamily: 'Inter var, Inter, sans-serif' },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
})

function ColorSchemeSync({ mode }: { mode: 'light' | 'dark' }) {
  const { setMode } = useColorScheme()
  useLayoutEffect(() => {
    setMode(mode)
  }, [mode, setMode])
  return null
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color mode',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    ((Story, context) => {
      const colorScheme = (context.globals.theme || 'light') as 'light' | 'dark'

      return (
        <QueryClientProvider client={queryClient}>
          <SettingsStoreProvider config={widgetConfig}>
            <WidgetProvider config={widgetConfig}>
              <SDKClientProvider>
                <ThemeProvider
                  theme={theme}
                  storageManager={null}
                  disableTransitionOnChange
                >
                  <CssBaseline enableColorScheme />
                  <ColorSchemeSync mode={colorScheme} />
                  <Story />
                </ThemeProvider>
              </SDKClientProvider>
            </WidgetProvider>
          </SettingsStoreProvider>
        </QueryClientProvider>
      )
    }) as Decorator,
  ],
  parameters: {
    backgrounds: { disable: true },
    layout: 'centered',
  },
}

export default preview
