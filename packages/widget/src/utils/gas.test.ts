import type { LiFiStepExtended, RouteExtended, Token } from '@lifi/sdk'
import { ChainType } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import { getRequiredGasAmount, getSelfFundedGasAmount } from './gas.js'

const solanaChainId = 1151111081099710
const stellarChainId = 1201081091099710

const makeToken = (chainId: number, address: string, symbol: string): Token =>
  ({
    chainId,
    address,
    symbol,
    decimals: 7,
    name: symbol,
    priceUSD: '1',
  }) as Token

const xlmAddress = 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA'

const usdcSolana = makeToken(
  solanaChainId,
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'USDC'
)
const xlm = makeToken(stellarChainId, xlmAddress, 'XLM')
const usdcStellar = makeToken(
  stellarChainId,
  'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
  'USDC'
)

const makeStep = (step: {
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmountMin: string
  gasToken?: Token
}): LiFiStepExtended =>
  ({
    action: {
      fromToken: step.fromToken,
      toToken: step.toToken,
      fromAmount: step.fromAmount,
      fromChainId: step.fromToken.chainId,
      toChainId: step.toToken.chainId,
    },
    estimate: {
      fromAmount: step.fromAmount,
      toAmountMin: step.toAmountMin,
      gasCosts: step.gasToken
        ? [{ token: step.gasToken, amount: '200' }]
        : undefined,
    },
  }) as unknown as LiFiStepExtended

const makeRoute = (steps: LiFiStepExtended[]): RouteExtended =>
  ({ steps }) as unknown as RouteExtended

// Solana USDC -> Stellar XLM -> Stellar USDC, the bridge leaves 4 XLM behind
const bridgeStep = makeStep({
  fromToken: usdcSolana,
  toToken: xlm,
  fromAmount: '4000000',
  toAmountMin: '191028247',
})
const swapStep = makeStep({
  fromToken: xlm,
  toToken: usdcStellar,
  fromAmount: '151219467',
  toAmountMin: '29621641',
  gasToken: xlm,
})

describe('getSelfFundedGasAmount', () => {
  it('should return the amount the bridge step leaves for the swap step', () => {
    const route = makeRoute([bridgeStep, swapStep])
    expect(getSelfFundedGasAmount(route, swapStep, ChainType.STL)).toBe(
      39808780n
    )
  })

  it('should return zero outside Stellar', () => {
    const route = makeRoute([bridgeStep, swapStep])
    expect(getSelfFundedGasAmount(route, swapStep, ChainType.EVM)).toBe(0n)
    expect(getSelfFundedGasAmount(route, swapStep, undefined)).toBe(0n)
  })

  it('should return zero for the first step', () => {
    const route = makeRoute([bridgeStep, swapStep])
    expect(getSelfFundedGasAmount(route, bridgeStep, ChainType.STL)).toBe(0n)
  })

  it('should return zero without a gas cost', () => {
    const step = makeStep({
      fromToken: xlm,
      toToken: usdcStellar,
      fromAmount: '151219467',
      toAmountMin: '29621641',
    })
    expect(
      getSelfFundedGasAmount(makeRoute([bridgeStep, step]), step, ChainType.STL)
    ).toBe(0n)
  })

  it('should return zero when the previous step delivers another token', () => {
    const previousStep = makeStep({
      fromToken: usdcSolana,
      toToken: usdcStellar,
      fromAmount: '4000000',
      toAmountMin: '191028247',
    })
    const step = makeStep({
      fromToken: usdcStellar,
      toToken: xlm,
      fromAmount: '1000',
      toAmountMin: '1000',
      gasToken: xlm,
    })
    expect(
      getSelfFundedGasAmount(
        makeRoute([previousStep, step]),
        step,
        ChainType.STL
      )
    ).toBe(0n)
  })

  it('should return zero when the previous step delivers on another chain', () => {
    const nativeSolana = makeToken(
      solanaChainId,
      '11111111111111111111111111111111',
      'SOL'
    )
    const previousStep = makeStep({
      fromToken: usdcSolana,
      toToken: nativeSolana,
      fromAmount: '4000000',
      toAmountMin: '191028247',
    })
    const step = makeStep({
      fromToken: usdcStellar,
      toToken: xlm,
      fromAmount: '1000',
      toAmountMin: '1000',
      gasToken: xlm,
    })
    expect(
      getSelfFundedGasAmount(
        makeRoute([previousStep, step]),
        step,
        ChainType.STL
      )
    ).toBe(0n)
  })

  it('should return zero when the step consumes the whole delivered amount', () => {
    const step = makeStep({
      fromToken: xlm,
      toToken: usdcStellar,
      fromAmount: '191028247',
      toAmountMin: '29621641',
      gasToken: xlm,
    })
    expect(
      getSelfFundedGasAmount(makeRoute([bridgeStep, step]), step, ChainType.STL)
    ).toBe(0n)
  })

  it('should compare token addresses without case', () => {
    const previousStep = makeStep({
      fromToken: usdcSolana,
      toToken: makeToken(stellarChainId, xlmAddress.toLowerCase(), 'XLM'),
      fromAmount: '4000000',
      toAmountMin: '191028247',
    })
    const step = makeStep({
      fromToken: usdcStellar,
      toToken: usdcStellar,
      fromAmount: '1000',
      toAmountMin: '1000',
      gasToken: xlm,
    })
    expect(
      getSelfFundedGasAmount(
        makeRoute([previousStep, step]),
        step,
        ChainType.STL
      )
    ).toBe(191028247n)
  })
})

describe('getRequiredGasAmount', () => {
  // The bridge step delivers 191028247 XLM and the swap step consumes
  // 151219467 of it, so the route self funds 39808780 towards the gas.
  const selfFunded = 39808780n

  // makeStep hardcodes a gas cost of 200, and getSelfFundedGasAmount looks the
  // step up by identity, so the route has to be built around the same object.
  const routeWithGasCost = (amount: string) => {
    const step = makeStep({
      fromToken: xlm,
      toToken: usdcStellar,
      fromAmount: '151219467',
      toAmountMin: '29621641',
      gasToken: xlm,
    })
    step.estimate.gasCosts = [{ ...step.estimate.gasCosts![0], amount }]
    return { route: makeRoute([bridgeStep, step]), step }
  }

  it('should book only the shortfall when the route funds part of the gas', () => {
    const { route, step } = routeWithGasCost(String(selfFunded + 10191220n))
    expect(getRequiredGasAmount(route, step, ChainType.STL)).toBe(10191220n)
  })

  it('should book nothing when the route funds more than the gas cost', () => {
    const { route, step } = routeWithGasCost(String(selfFunded - 1n))
    expect(getRequiredGasAmount(route, step, ChainType.STL)).toBe(0n)
  })

  it('should book nothing when the route funds it exactly', () => {
    const { route, step } = routeWithGasCost(String(selfFunded))
    expect(getRequiredGasAmount(route, step, ChainType.STL)).toBe(0n)
  })

  it('should book the whole cost when the route funds none of it', () => {
    const { route, step } = routeWithGasCost('50000000')
    expect(getRequiredGasAmount(route, step, ChainType.EVM)).toBe(50000000n)
  })

  it('should sum every gas cost entry before subtracting', () => {
    const { route, step } = routeWithGasCost('50000000')
    step.estimate.gasCosts = [
      ...step.estimate.gasCosts!,
      { ...step.estimate.gasCosts![0], amount: '50000000' },
    ]
    expect(getRequiredGasAmount(route, step, ChainType.STL)).toBe(
      100000000n - selfFunded
    )
  })

  it('should book nothing without a gas cost', () => {
    const step = makeStep({
      fromToken: xlm,
      toToken: usdcStellar,
      fromAmount: '151219467',
      toAmountMin: '29621641',
    })
    expect(
      getRequiredGasAmount(makeRoute([bridgeStep, step]), step, ChainType.STL)
    ).toBe(0n)
  })
})
