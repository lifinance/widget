import type { BaseToken } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type {
  AllowDeny,
  AllowDenyItems,
  AllowDenySet,
  AllowDenySets,
} from '../types/widget.js'

// Use for a single item check
export const isItemAllowed = <T>(
  item: T,
  items: AllowDeny<T> | undefined
): boolean => {
  if (items?.allow?.length) {
    return items.allow.includes(item)
  }
  return !items?.deny?.includes(item)
}

// Use for a O(1) set lookup of multiple items check
export const isItemAllowedForSets = <T>(
  item: T,
  items: AllowDenySet | undefined,
  getKey: (item: T) => string
): boolean => {
  if (items?.allow?.size) {
    return items.allow.has(getKey(item))
  }
  return !items?.deny?.has(getKey(item))
}

export const getConfigItemSets = <T>(
  items: AllowDenyItems<T> | undefined,
  getSet: (items: T[]) => Set<string>,
  formType?: FormType
): AllowDenySets | undefined => {
  if (!items) {
    return undefined
  }
  return {
    allow: getSet(items.allow ?? []),
    deny: getSet(items.deny ?? []),
    ...(formType && {
      [formType]: {
        allow: getSet(items[formType]?.allow ?? []),
        deny: getSet(items[formType]?.deny ?? []),
      },
    }),
  }
}

export const isTokenAllowed = (
  token: BaseToken,
  configTokens: AllowDenySets | undefined,
  formType?: FormType
) => {
  return (
    isItemAllowedForSets(
      token,
      configTokens,
      (t) => `${t.address}-${t.chainId}`
    ) &&
    (formType
      ? isItemAllowedForSets(
          token,
          configTokens?.[formType],
          (t) => `${t.address}-${t.chainId}`
        )
      : true)
  )
}
