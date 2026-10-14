// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { getDefaultValuesFromQueryString } from './getDefaultValuesFromQueryString.js'

const openWith = (search: string) => {
  window.history.replaceState(null, '', `/${search}`)
}

describe('getDefaultValuesFromQueryString', () => {
  it('ignores a destination-only source chain together with its token', () => {
    openWith('?fromChain=20000000000005&fromToken=zcash&toChain=1')

    const values = getDefaultValuesFromQueryString({ buildUrl: true })

    expect(values.fromChain).toBeUndefined()
    expect(values.fromToken).toBeUndefined()
    expect(values.toChain).toBe(1)
  })

  it('ignores a destination chain the chains config denies, with its token', () => {
    openWith('?fromChain=1&toChain=20000000000005&toToken=zcash')

    const values = getDefaultValuesFromQueryString({
      buildUrl: true,
      chains: { deny: [20000000000005] },
    })

    expect(values.fromChain).toBe(1)
    expect(values.toChain).toBeUndefined()
    expect(values.toToken).toBeUndefined()
  })

  it('keeps a destination-only chain as the destination', () => {
    openWith('?fromChain=1&toChain=20000000000005')

    expect(getDefaultValuesFromQueryString({ buildUrl: true })).toMatchObject({
      fromChain: 1,
      toChain: 20000000000005,
    })
  })
})
