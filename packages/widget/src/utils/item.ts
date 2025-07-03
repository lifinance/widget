import type { BaseToken } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type { AllowDeny, WidgetTokens } from '../types/widget.js'

type IncludesFn<T> = (list: T[], item: T) => boolean

export const isItemAllowed = <T>(
  item: T,
  items?: AllowDeny<T>,
  includes: IncludesFn<T> = (list, val) => list.includes(val)
): boolean => {
  if (items?.allow?.length) {
    return includes(items.allow, item)
  }

  return !includes(items?.deny ?? [], item)
}

const tokenIncludes = (list: BaseToken[], item: BaseToken) =>
  list.some((t) => t.address === item.address && t.chainId === item.chainId)

export const isTokenAllowed = (
  token: BaseToken,
  configTokens: WidgetTokens | undefined,
  formType: FormType | undefined
) => {
  return (
    isItemAllowed(token, configTokens, tokenIncludes) &&
    (formType
      ? isItemAllowed(token, configTokens?.[formType], tokenIncludes)
      : true)
  )
}

export const filterConfigTokensByChain = (
  configTokens: WidgetTokens | undefined,
  formType: FormType | undefined,
  chainId: number
) => {
  if (!configTokens) {
    return configTokens
  }

  return {
    ...configTokens,
    allow: configTokens.allow?.filter((t) => t.chainId === chainId) ?? [],
    deny: configTokens.deny?.filter((t) => t.chainId === chainId) ?? [],
    ...(formType && {
      [formType]: {
        allow:
          configTokens[formType]?.allow?.filter((t) => t.chainId === chainId) ??
          [],
        deny:
          configTokens[formType]?.deny?.filter((t) => t.chainId === chainId) ??
          [],
      },
    }),
  }
}
