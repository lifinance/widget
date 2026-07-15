import { createTheme, ThemeProvider } from '@mui/material'
import {
  type RenderOptions,
  type RenderResult,
  render,
} from '@testing-library/react'
import i18n from 'i18next'
import type { ComponentType, ReactElement, ReactNode } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'

const testI18n = i18n.createInstance()
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    en: {
      translation: {
        button: { close: 'Close', cancel: 'Cancel' },
        checkout: {
          closeConfirmation: {
            title: 'Leave checkout?',
            body: "Closing won't cancel your deposit. You can come back to check on it here anytime.",
            confirm: 'Close checkout',
            cancel: 'Cancel',
          },
          abandonConfirmation: {
            title: 'Cancel this transfer?',
            body: "Your deposit details will be discarded. Don't send funds to this address after cancelling.",
            confirm: 'Cancel transfer',
            cancel: 'Keep transfer',
          },
          activity: {
            title: 'Activity',
            deposit: 'Deposit',
            amountOnChain: '{{amount}} {{symbol}} on {{chain}}',
            depositInProgress: 'Deposit in progress',
            refundInProgress: 'Refund in progress',
            couldNotComplete: "Couldn't complete",
            singleFailed: 'Deposit failed. Please resolve',
            dismiss: 'Dismiss',
          },
          transak: {
            forceClose: {
              tooltip: "Close (transaction won't resume)",
            },
          },
          transactionStatus: {
            watching: 'Watching for transaction',
            executing: 'Processing transaction',
            detailsTitle: 'Transaction details',
            steps: {
              receive: {
                upcoming: 'Receive {{symbol}}',
                loading: 'Receiving {{symbol}}',
                done: '{{symbol}} received',
              },
              swap: {
                upcoming: 'Swap to {{symbol}}',
                loading: 'Swapping to {{symbol}}',
                done: 'Swapped to {{symbol}}',
              },
              bridge: {
                upcoming: 'Bridge to {{chain}}',
                loading: 'Bridging to {{chain}}',
                done: 'Bridged to {{chain}}',
              },
            },
          },
          onramp: { errors: { generic: 'Something went wrong.' } },
        },
      },
    },
  },
})

// Shim custom theme keys that widget/createTheme adds at runtime.
const testTheme = createTheme({
  cssVariables: true,
  shape: { borderRadius: 12 },
})
const themeAny = testTheme as unknown as Record<string, any>

themeAny.vars ??= {}
themeAny.vars.shape ??= {}
themeAny.vars.shape.borderRadius ??= '12px'
themeAny.vars.shape.borderRadiusTertiary = '24px'
themeAny.vars.palette ??= {}
themeAny.vars.palette.common ??= {}
themeAny.vars.palette.common.onBackgroundChannel = '0 0 0'
themeAny.vars.palette.background ??= { default: '#fff' }

export function renderWithI18n(
  ui: ReactElement,
  options?: RenderOptions
): RenderResult {
  const userWrapper = options?.wrapper as
    | ComponentType<{
        children: ReactNode
      }>
    | undefined
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={testTheme}>
      <I18nextProvider i18n={testI18n}>
        {userWrapper
          ? (() => {
              const Inner = userWrapper
              return <Inner>{children}</Inner>
            })()
          : children}
      </I18nextProvider>
    </ThemeProvider>
  )
  return render(ui, { ...options, wrapper })
}
