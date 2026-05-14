/** Reads a nested value from an object using a dot-separated path (e.g. "theme.palette.primary.main"). */
export const getValueFromPath = <T>(
  object: any | undefined,
  path: string
): T | undefined => {
  if (!object) {
    return undefined
  }

  const splitPath = path.split('.')

  let value = object
  for (let i = 0; i < splitPath.length; i++) {
    value = (value as any)[splitPath[i]]
    if (value === undefined) {
      break
    }
  }

  return value as T
}
