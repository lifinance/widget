export type UnsupportedToAddressClearAction = 'none' | 'consumer' | 'form'

export interface UnsupportedToAddressClearInput {
  unsupportedToAddress: boolean
  toAddressFieldValue: string | undefined
  isConfiguredAddress: boolean
  hasConsumerClear: boolean
}

// Clearing the form field directly fights consumer-owned recipient state, which
// rewrites it and loops. Delegating to the consumer clears both.
export const resolveUnsupportedToAddressClear = ({
  unsupportedToAddress,
  toAddressFieldValue,
  isConfiguredAddress,
  hasConsumerClear,
}: UnsupportedToAddressClearInput): UnsupportedToAddressClearAction => {
  if (!unsupportedToAddress || !toAddressFieldValue) {
    return 'none'
  }
  if (isConfiguredAddress) {
    return 'none'
  }
  return hasConsumerClear ? 'consumer' : 'form'
}
