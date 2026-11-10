import type {
  FeeCost,
  GasCost,
  LiFiStep,
  RouteExtended,
  Token,
} from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import { getAccumulatedFeeCostsBreakdown } from './fees.js'

const ETH = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 42161,
  symbol: 'ETH',
  decimals: 18,
  priceUSD: '2000',
} as Token

const USDC = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  chainId: 42161,
  symbol: 'USDC',
  decimals: 6,
  priceUSD: '1',
} as Token

// 0.00004 ETH at 2000 USD = 0.08 USD of relayer gas.
const gasCost = { amount: '40000000000000', token: ETH } as GasCost

const relayFee = {
  name: 'LIFI Gasless Relay Fee',
  amount: '86200',
  included: true,
  token: USDC,
} as FeeCost

const step = (feeCosts: FeeCost[]): LiFiStep =>
  ({ estimate: { gasCosts: [gasCost], feeCosts } }) as unknown as LiFiStep

const route = (...steps: LiFiStep[]): RouteExtended =>
  ({ steps }) as unknown as RouteExtended

describe('getAccumulatedFeeCostsBreakdown', () => {
  it('counts no gas for a gasless step, because the relayer pays it', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(route(step([relayFee])))

    expect(breakdown.gasCosts).toEqual([])
    expect(breakdown.gasCostUSD).toBe(0)
    expect(breakdown.combinedFeesUSD).toBe(0)
  })

  it('keeps the gas of a step that is not gasless in the same route', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(
      route(step([relayFee]), step([]))
    )

    expect(breakdown.gasCostUSD).toBeCloseTo(0.08)
  })

  it('keeps the gas of a route without the relay fee', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(route(step([])))

    expect(breakdown.gasCosts).toHaveLength(1)
    expect(breakdown.gasCostUSD).toBeCloseTo(0.08)
    expect(breakdown.combinedFeesUSD).toBeCloseTo(0.08)
  })
})
