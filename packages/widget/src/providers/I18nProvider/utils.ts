import type { LanguageResource } from './types.js'

// Recursively convert all string values to empty strings
export function makeEmptyStrings(obj: LanguageResource): LanguageResource {
  const result = {} as LanguageResource
  for (const key in obj) {
    const value = obj[key as keyof LanguageResource]
    if (typeof value === 'string') {
      result[key as keyof LanguageResource] = '' as any
    } else if (typeof value === 'object' && value !== null) {
      result[key as keyof LanguageResource] = makeEmptyStrings(
        value as unknown as LanguageResource
      ) as any
    }
  }
  return result
}
