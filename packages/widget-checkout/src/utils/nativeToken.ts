export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

export const isNativeToken = (address?: string): boolean =>
  address?.toLowerCase() === NATIVE_TOKEN_ADDRESS
