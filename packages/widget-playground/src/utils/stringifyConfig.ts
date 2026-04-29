import type { WidgetConfig } from '@lifi/widget'
import { addFunctionsAsStrings } from './addFunctionsAsStrings.js'
import { cloneStructuredConfig } from './cloneStructuredConfig.js'
import { substituteFunctions } from './substituteFunctions.js'

const configTemplate = (config?: string) =>
  config ? `const config = ${config}` : undefined

export function stringifyConfig(
  config: Partial<WidgetConfig>,
  template: (config?: string) => string | undefined = configTemplate
): string | undefined {
  const clonedConfig = cloneStructuredConfig(config)

  const functionsReferences = substituteFunctions(clonedConfig, 'id')

  const stringifiedConfig = addFunctionsAsStrings(
    JSON.stringify(clonedConfig, null, 2),
    functionsReferences
  )

  const templatedCode = template(
    stringifiedConfig.replace(/"([^"]+)":/g, '$1:')
  )

  return templatedCode ? templatedCode : undefined
}
