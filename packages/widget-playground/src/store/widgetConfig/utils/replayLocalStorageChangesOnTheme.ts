import type { WidgetConfig, WidgetTheme } from '@lifi/widget'
import diff from 'microdiff'
import { cloneStructuredConfig } from '../../../utils/cloneStructuredConfig.js'
import { patch } from '../../../utils/patch.js'
import { getLocalStorageOutput } from './getLocalStorageOutput.js'

export const replayLocalStorageChangesOnTheme = (
  theme: WidgetTheme,
  localStoredConfig: Partial<WidgetConfig>
) => {
  const tempConfig: Partial<WidgetConfig> = { theme }

  const differences = diff(
    getLocalStorageOutput(tempConfig),
    getLocalStorageOutput(localStoredConfig)
  )

  const updatedConfig = patch(
    cloneStructuredConfig<Partial<WidgetConfig>>(tempConfig),
    differences
  ) as Partial<WidgetConfig>

  return updatedConfig.theme!
}
