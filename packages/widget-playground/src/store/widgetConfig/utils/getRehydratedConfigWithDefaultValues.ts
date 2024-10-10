import type { WidgetConfig } from '@lifi/widget'
import diff from 'microdiff'
import { cloneStructuredConfig, patch } from '../../../utils'
import { getLocalStorageOutput } from './getLocalStorageOutput'

export const getRehydratedConfigWithDefaultValues = (
  configFromLocalStorage: Partial<WidgetConfig>,
  defaultConfig: Partial<WidgetConfig>
) => {
  const configWithDefaultValues =
    cloneStructuredConfig<Partial<WidgetConfig>>(defaultConfig)

  const differences = diff(
    getLocalStorageOutput(configWithDefaultValues),
    getLocalStorageOutput(configFromLocalStorage)
  )

  return patch(configWithDefaultValues, differences) as Partial<WidgetConfig>
}
