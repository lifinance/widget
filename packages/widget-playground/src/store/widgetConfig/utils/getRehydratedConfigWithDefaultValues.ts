import type { WidgetConfig } from '@lifi/widget'
import diff from 'microdiff'
import { cloneStructuredConfig } from '../../../utils/cloneStructuredConfig.js'
import { patch } from '../../../utils/patch.js'
import { getLocalStorageOutput } from './getLocalStorageOutput.js'

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
