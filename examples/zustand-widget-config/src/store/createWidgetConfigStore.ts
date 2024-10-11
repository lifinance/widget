import type { WidgetConfig } from '@lifi/widget'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'
import type { WidgetConfigState } from './types'

const initialWidgetConfig = {
  // When buildUrl is set to true the widget will build and maintain URL search params
  buildUrl: true,
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
}

export const useWidgetConfigStore = createWithEqualityFn<WidgetConfigState>(
  (set, get) => ({
    config: initialWidgetConfig,
    setConfig: (config) => {
      set({
        config,
      })
    },
    setFormValues: (formValues) => {
      const config = get().config ?? {}

      // we remove the updatable form values as we only want pass properties with
      // updated values. Only updated values should be specified in the config (even if that a value of undefined)
      // formUpdateKey here is passed in from the FormControl component to ensure updates
      ;[
        'fromAmount',
        'fromChain',
        'fromToken',
        'toAddress',
        'toChain',
        'toToken',
      ].forEach((key) => {
        delete config[key as keyof WidgetConfig]
      })

      set({
        config: {
          ...get().config,
          ...(formValues as Partial<WidgetConfig>),
        },
      })
    },
  }),
  shallow
)
