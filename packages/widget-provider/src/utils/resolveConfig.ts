// Resolve config values: true = use defaults, object = use that, false/undefined = skip
export const resolveConfig = <T>(
  value: T | boolean | undefined,
  defaultValue: T
): T | undefined => {
  if (value === true) {
    return defaultValue
  }
  if (value === false || value === undefined) {
    return undefined
  }
  return value
}
