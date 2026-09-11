import type { ChainType } from '@lifi/sdk'

/**
 * True when a token search query is a contract address rather than free text.
 * `getChainTypeFromTokenAddress` asks the configured providers' own
 * `isTokenAddress` (see `useChainTypeFromAddress`), so it covers the token
 * identifier of every ecosystem. Two consequences follow. `bitcoin` stays a
 * name search, because the Bitcoin provider implements no token check. And an
 * ecosystem is not detected unless the host configures its provider from
 * `@lifi/sdk` 4.7.0 or later, even when its chains are listed.
 */
export const isAddressQuery = (
  query: string | undefined,
  getChainTypeFromTokenAddress: (address: string) => ChainType | undefined
): boolean => {
  const value = query?.trim()
  if (!value) {
    return false
  }
  return getChainTypeFromTokenAddress(value) !== undefined
}
