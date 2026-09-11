import { ChainType } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import { isAddressQuery } from './address.js'

const evmAddress = '0xB095274743941e953c746F9C228DA9c18Bb6ec29'
const solanaMint = 'LAPvT8fzcPt7WzcrEvdQVYWWJMvCZz2yLJ25b1SwTtC'
const stellarContract =
  'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75'

/**
 * Stands in for the providers' token check. It recognizes the values the
 * Ethereum, Solana and Stellar providers accept as token identifiers, as
 * `getChainTypeFromTokenAddress` does. `bitcoin` is absent: the Bitcoin
 * provider implements no token check.
 */
const getChainTypeFromTokenAddress = (
  address: string
): ChainType | undefined => {
  // A provider validates by parsing, so it can throw on a value it cannot
  // read: `@solana/kit` does for `undefined`. The guard in `isAddressQuery`
  // is what keeps one from ever seeing such a value.
  if (!address.trim()) {
    throw new Error('empty address')
  }
  if (address === evmAddress) {
    return ChainType.EVM
  }
  if (address === solanaMint) {
    return ChainType.SVM
  }
  if (address === stellarContract) {
    return ChainType.STL
  }
  return undefined
}

describe('isAddressQuery', () => {
  it('accepts a value the token check recognizes', () => {
    expect(isAddressQuery(solanaMint, getChainTypeFromTokenAddress)).toBe(true)
    expect(isAddressQuery(stellarContract, getChainTypeFromTokenAddress)).toBe(
      true
    )
  })

  it('rejects free text', () => {
    expect(isAddressQuery('laptop', getChainTypeFromTokenAddress)).toBe(false)
    expect(isAddressQuery('Hunter Biden', getChainTypeFromTokenAddress)).toBe(
      false
    )
  })

  it('rejects the Bitcoin native token identifier, which is a name', () => {
    // A text search for `bitcoin` returns every token named after it, so the
    // list must keep matching names and symbols.
    expect(isAddressQuery('bitcoin', getChainTypeFromTokenAddress)).toBe(false)
  })

  it('ignores surrounding whitespace', () => {
    expect(
      isAddressQuery(`  ${evmAddress}\n`, getChainTypeFromTokenAddress)
    ).toBe(true)
  })

  it('rejects an empty query', () => {
    expect(isAddressQuery('', getChainTypeFromTokenAddress)).toBe(false)
    expect(isAddressQuery('   ', getChainTypeFromTokenAddress)).toBe(false)
    expect(isAddressQuery(undefined, getChainTypeFromTokenAddress)).toBe(false)
  })
})
