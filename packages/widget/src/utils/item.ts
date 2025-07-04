import type { BaseToken } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type {
  AllowDeny,
  AllowDenyItems,
  AllowDenySet,
  AllowDenySets,
} from '../types/widget.js'

export const isItemAllowed = <T>(
  item: T,
  items: AllowDeny<T> | undefined
): boolean => {
  if (items?.allow?.length) {
    return items.allow.includes(item)
  }
  return !items?.deny?.includes(item)
}

// Optimized version for O(1) lookup
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

export const getTokenKey = (token: BaseToken) =>
  `${token.address}-${token.chainId}`

export const isTokenAllowed = (
  token: BaseToken,
  configTokens: AllowDenySets | undefined,
  formType: FormType | undefined
) => {
  return (
    isItemAllowedForSets(token, configTokens, getTokenKey) &&
    (formType
      ? isItemAllowedForSets(token, configTokens?.[formType], getTokenKey)
      : true)
  )
}

const buildAllowDenySet = <T>(
  items: AllowDenyItems<T>,
  formType: FormType | undefined,
  getSet: (items: T[]) => Set<string>
) => {
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

export const getWidgetItemSets = <T>(
  configTokens: AllowDenyItems<T> | undefined,
  formType: FormType | undefined,
  getSet: (items: T[]) => Set<string>
): AllowDenySets | undefined => {
  if (!configTokens) {
    return undefined
  }
  return buildAllowDenySet(configTokens, formType, getSet)
}
