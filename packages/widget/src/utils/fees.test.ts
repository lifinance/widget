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

const SHIB = {
  address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  chainId: 1,
  symbol: 'SHIB',
  decimals: 18,
  priceUSD: '0.000003868244762',
} as Token

const shibFee = (amount: string, included: boolean): FeeCost =>
  ({
    name: 'LIFI Fixed Fee',
    amount,
    included,
    token: SHIB,
  }) as FeeCost

const stepWithGas = (gasAmount: string): LiFiStep =>
  ({
    estimate: {
      gasCosts: [{ amount: gasAmount, token: ETH }],
      feeCosts: [],
    },
  }) as unknown as LiFiStep

describe('getAccumulatedFeeCostsBreakdown bigint fee amounts', () => {
  it('keeps the captured SHIB fee when included fees are requested via the public helper', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(
      route(step([shibFee('2500000000000000000000000', true)])),
      true
    )

    expect(breakdown.feeCosts).toHaveLength(1)
    expect(breakdown.feeCosts[0].amount).toBe(2500000000000000000000000n)
  })

  it('filters included fees on the default path', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(
      route(step([shibFee('2500000000000000000000000', true)]))
    )

    expect(breakdown.feeCosts).toEqual([])
    expect(breakdown.feeCostUSD).toBe(0)
  })

  it('accumulates a non-included fee above 1e21 on the default path', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(
      route(step([shibFee('2500000000000000000000000', false)]))
    )

    expect(breakdown.feeCosts).toHaveLength(1)
    expect(breakdown.feeCosts[0].amount).toBe(2500000000000000000000000n)
  })

  it('sums same-token included fees in one step without losing precision', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(
      route(
        step([
          shibFee('9007199254740993', true),
          shibFee('9007199254740993', true),
        ])
      ),
      true
    )

    expect(breakdown.feeCosts).toHaveLength(1)
    expect(breakdown.feeCosts[0].amount).toBe(18014398509481986n)
  })

  it('groups same-token included fees across steps without losing precision', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(
      route(
        step([shibFee('2500000000000000000000000', true)]),
        step([shibFee('9007199254740993', true)])
      ),
      true
    )

    expect(breakdown.feeCosts).toHaveLength(1)
    expect(breakdown.feeCosts[0].amount).toBe(
      2500000000000000000000000n + 9007199254740993n
    )
  })

  it('keeps gas amounts above 2^53 exact in the breakdown', () => {
    const breakdown = getAccumulatedFeeCostsBreakdown(
      route(stepWithGas('188437049834009001'))
    )

    expect(breakdown.gasCosts).toHaveLength(1)
    expect(breakdown.gasCosts[0].amount).toBe(188437049834009001n)
  })
})
