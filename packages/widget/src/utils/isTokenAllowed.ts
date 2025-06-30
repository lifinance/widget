import type { Token } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type { WidgetTokens } from '../types/widget.js'

export const isTokenAllowed = (
  token: Token,
  configTokens: WidgetTokens | undefined,
  formType: FormType | undefined
) => {
  const { deny: globalDeny = [], allow: globalAllow = [] } = configTokens ?? {} // applies to both "from" and "to"
  const { deny: formDeny = [], allow: formAllow = [] } = formType
    ? (configTokens?.[formType] ?? {})
    : {}

  // Get chain-specific deny and allow lists
  const denyList = [
    ...globalDeny.filter(
      (t) =>
        t.chainId === token.chainId &&
        // overwrite global deny with formType-specific allow
        !formAllow.some(
          (a) => a.address === t.address && a.chainId === t.chainId
        )
    ),
    ...formDeny.filter((t) => t.chainId === token.chainId),
  ]

  // Deny takes precedence over allow
  const isDenied = denyList.some((t) => t.address === token.address)

  if (isDenied) {
    return false
  }

  const allowList = [
    ...globalAllow.filter(
      (t) =>
        t.chainId === token.chainId &&
        // overwrite global allow with formType-specific deny
        !formDeny.some(
          (d) => d.address === t.address && d.chainId === t.chainId
        )
    ),
    ...formAllow.filter((t) => t.chainId === token.chainId),
  ]

  // If no allow list is defined, it's allowed
  if (!allowList.length) {
    return true
  }

  return allowList.some((t) => t.address === token.address)
}
