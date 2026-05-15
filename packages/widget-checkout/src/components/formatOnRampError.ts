import type { OnRampError } from '@lifi/widget-provider/checkout'
import type { TFunction } from 'i18next'

export function formatOnRampError(
  error: OnRampError | null,
  providerName: string,
  t: TFunction
): string | null {
  if (!error) {
    return null
  }
  if (error.message) {
    return error.message
  }
  if (error.code) {
    // `providerName` after the spread so a stray host-supplied param can't
    // overwrite the widget-resolved provider name.
    return t(`checkout.onramp.errors.${error.code}`, {
      ...error.params,
      providerName,
    })
  }
  return null
}
