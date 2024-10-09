import { rehydrateFunctions } from '../store/widgetConfig/utils/rehydrateFunctions'
import type { FunctionReference, ObjectWithFunctions } from '../types'
import { substituteFunctions } from './substituteFunctions'

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
 * Some parts of the config use functions which can't easily be cloned, converted to JSON or output to
 * localstorage. This function should help to temporary substitute those values when we clone and restore
 * those values afterwards.
 * NOTE: any shallow references like walletConfig.onConnect are not treated as deep copies - the reference in the configs is different
 * but the object of that reference with be share between the original and the cloned config.
 *
 * @param original The object that you want to clone
 */
export const cloneStructuredConfig = <T>(original: T) => {
  const { substituteShallowReferences, rehydrateShallowReferences } =
    shallowReferences()

  const clone = rehydrateShallowReferences(
    structuredClone(substituteShallowReferences(original))
  )

  // we need restore the original as well
  rehydrateShallowReferences(original)

  return clone as T
}
