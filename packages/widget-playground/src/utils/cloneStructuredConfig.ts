import { rehydrateFunctions } from '../store/widgetConfig/utils/rehydrateFunctions.js'
import type { FunctionReference, ObjectWithFunctions } from '../types.js'
import { substituteFunctions } from './substituteFunctions.js'

const shallowReferences = () => {
  let referencesDictionary: FunctionReference[] = []
  const substituteShallowReferences = <T>(config: T): T => {
    referencesDictionary = substituteFunctions(config as ObjectWithFunctions)
    return config
  }

  const rehydrateShallowReferences = <T>(config: T): T => {
    rehydrateFunctions(config as ObjectWithFunctions, referencesDictionary)

    return config
  }

  return {
    substituteShallowReferences,
    rehydrateShallowReferences,
  }
}

/**
 * Clones config objects that contain functions by temporarily substituting them,
 * then rehydrating both the clone and the original.
 */
export const cloneStructuredConfig = <T>(original: T) => {
  const { substituteShallowReferences, rehydrateShallowReferences } =
    shallowReferences()

  const clone = rehydrateShallowReferences(
    structuredClone(substituteShallowReferences(original))
  )

  rehydrateShallowReferences(original)

  return clone as T
}
