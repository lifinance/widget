import type { Route } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import { getMatchingLabels } from './getMatchingLabels.js'

const checksummedFromAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const checksummedToAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'

const route = {
  fromChainId: 1,
  toChainId: 137,
  fromToken: { address: checksummedFromAddress },
  toToken: { address: checksummedToAddress },
  steps: [],
} as unknown as Route

describe('getMatchingLabels', () => {
  it('matches when the config address is checksummed like the route', () => {
    const labels = getMatchingLabels(route, [
      {
        label: { text: 'USDC Bonus' },
        fromTokenAddress: [checksummedFromAddress],
      },
    ])
    expect(labels).toEqual([{ text: 'USDC Bonus' }])
  })

  it('matches when the config address is lowercase (as the repo default config writes it)', () => {
    const labels = getMatchingLabels(route, [
      {
        label: { text: 'USDC Bonus' },
        fromTokenAddress: [checksummedFromAddress.toLowerCase()],
      },
    ])
    expect(labels).toEqual([{ text: 'USDC Bonus' }])
  })

  it('matches on toTokenAddress regardless of casing', () => {
    const labels = getMatchingLabels(route, [
      {
        label: { text: 'POL Bonus' },
        toTokenAddress: [checksummedToAddress.toLowerCase()],
      },
    ])
    expect(labels).toEqual([{ text: 'POL Bonus' }])
  })

  it('matches on the numeric fromChainId criterion, unaffected by address-casing logic', () => {
    const labels = getMatchingLabels(route, [
      { label: { text: 'Chain rule' }, fromChainId: [1] },
    ])
    expect(labels).toEqual([{ text: 'Chain rule' }])
  })

  it('does not case-fold non-EVM (e.g. Solana base58) token identifiers', () => {
    const solanaRoute = {
      fromChainId: 1151111081099710,
      toChainId: 137,
      fromToken: { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
      toToken: { address: checksummedToAddress },
      steps: [],
    } as unknown as Route

    // A lowercase variant is a DIFFERENT, distinct base58 identifier on
    // Solana - it must not match the real (differently-cased) address.
    const lowercaseVariant = 'epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v'

    const labels = getMatchingLabels(solanaRoute, [
      {
        label: { text: 'Should not match' },
        fromTokenAddress: [lowercaseVariant],
      },
    ])
    expect(labels).toEqual([])

    const exactMatchLabels = getMatchingLabels(solanaRoute, [
      {
        label: { text: 'USDC on Solana' },
        fromTokenAddress: ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'],
      },
    ])
    expect(exactMatchLabels).toEqual([{ text: 'USDC on Solana' }])
  })
})
