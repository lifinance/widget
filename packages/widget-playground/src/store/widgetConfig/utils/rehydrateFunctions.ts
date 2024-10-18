import type { FunctionReference, ObjectWithFunctions } from '../../../types'

export function rehydrateFunctions(
  obj: ObjectWithFunctions,
  functionReferences: FunctionReference[]
): void {
  functionReferences.forEach(({ path, funcRef }) => {
    let currentObj: any = obj

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i]
      if (currentObj[key] === undefined) {
        // Create an object or array if the key doesn't exist
        currentObj[key] = typeof path[i + 1] === 'number' ? [] : {}
      }
      currentObj = currentObj[key]
    }

    const lastKey = path[path.length - 1]
    if (Array.isArray(currentObj)) {
      currentObj[Number(lastKey)] = funcRef
    } else {
      currentObj[lastKey] = funcRef
    }
  })
}
