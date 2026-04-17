import { SDKClientProvider } from '@lifi/widget/src/providers/SDKClientProvider'
import { WidgetProvider } from '@lifi/widget/src/providers/WidgetProvider/WidgetProvider'
import { StoreProvider } from '@lifi/widget/src/stores/StoreProvider'
import { SettingsStoreProvider } from '@lifi/widget/src/stores/settings/SettingsStore'
import { createTheme } from '@lifi/widget/src/themes/createTheme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import type { Decorator, Preview } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLayoutEffect } from 'react'

// Initialize i18n with widget translations (must run before components mount)
import './i18n'

const widgetConfig = { integrator: 'lifi-storybook' }

// Use the widget's real theme factory so every MUI component override
// (button `textTransform: 'none'`, card/tabs/avatar styling, drop-shadows,
// etc.) matches production. A plain MUI `createTheme` with just the
// palette would leave buttons uppercase, cards flat, etc.
const theme = createTheme()

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
                <StoreProvider config={widgetConfig}>
                  <ThemeProvider
                    theme={theme}
                    storageManager={null}
                    disableTransitionOnChange
                  >
                    <CssBaseline enableColorScheme />
                    <ColorSchemeSync mode={colorScheme} />
                    <Story />
                  </ThemeProvider>
                </StoreProvider>
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
