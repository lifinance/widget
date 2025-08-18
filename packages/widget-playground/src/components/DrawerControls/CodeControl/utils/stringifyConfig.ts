import type { WidgetConfig } from '@lifi/widget'
import { cloneStructuredConfig } from '../../../../utils/cloneStructuredConfig.js'
import { substituteFunctions } from '../../../../utils/substituteFunctions.js'
import { addFunctionsAsStrings } from './addFunctionsAsStrings.js'

const configTemplate = (config?: string) =>
  config ? `const config = ${config}` : undefined

export function stringifyConfig(
  config: Partial<WidgetConfig>,
  template = configTemplate
) {
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
