import type {
  Collection,
  FunctionReference,
  ObjectWithFunctions,
} from '../types'

export function substituteFunctions(
  obj: ObjectWithFunctions,
  substituteMode: 'object' | 'id' = 'object'
): FunctionReference[] {
  let id = 0
  const getSubstitutionId = () => `substitution::id::${++id}`

  const stack: { obj: ObjectWithFunctions; path: (string | number)[] }[] = [
    { obj, path: [] },
  ]
  const result: FunctionReference[] = []

  for (let i = 0; i < stack.length; i++) {
    const current = stack[i]
    const { obj: currentObj, path: currentPath } = current

    for (const key in currentObj) {
      const value = currentObj[key]
      const newPath = Array.isArray(currentObj)
        ? [...currentPath, Number(key)]
        : [...currentPath, key]

      if (typeof value === 'function') {
        // Substitute the function with an empty object or id in the original object
        const substituteId = substituteMode === 'id' ? getSubstitutionId() : {}
        ;(currentObj as Collection)[key] = substituteId

        result.push({
          path: newPath,
          funcRef: value,
          substituteId:
            typeof substituteId === 'string' ? substituteId : undefined,
        })
      } else if (Array.isArray(value)) {
        stack.push({ obj: value, path: newPath })
      } else if (typeof value === 'object' && value !== null) {
        stack.push({ obj: value, path: newPath })
      }
    }
  }

  return result
}
