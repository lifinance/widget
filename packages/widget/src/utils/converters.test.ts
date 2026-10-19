import type { ExtendedChain, FeeCost, FullStatusData, Token } from '@lifi/sdk'
import { describe, expect, it, vi } from 'vitest'
import { buildRouteFromTxHistory } from './converters.js'
import { getAccumulatedFeeCostsBreakdown } from './fees.js'

type TestToken = Pick<Token, 'address' | 'symbol' | 'decimals' | 'priceUSD'>

interface TestTransfer {
  chainId: number
  value: string
  amount: string
  token: TestToken
  gasToken?: TestToken
  feeCosts?: Partial<FeeCost>[]
}

const SOL: TestToken = {
  address: '11111111111111111111111111111111',
  symbol: 'SOL',
  decimals: 9,
  priceUSD: '104.50064266827546',
}

const ETH: TestToken = {
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ETH',
  decimals: 18,
  priceUSD: '2442.18',
}

const asToken = (token: TestToken, chainId: number): Token =>
  ({ ...token, chainId, name: token.symbol }) as Token

const fee = (
  chainId: number,
  token: TestToken,
  amount: string,
  included: boolean | undefined,
  name = 'Fee'
): Partial<FeeCost> => ({
  name,
  amount,
  included,
  token: asToken(token, chainId),
})

const buildTransfer = ({
  chainId,
  value,
  amount,
  token,
  gasToken = token,
  feeCosts,
}: TestTransfer): FullStatusData =>
  ({
    transactionId: '0x01',
    status: 'DONE',
    substatus: 'COMPLETED',
    tool: 'test',
    fromAddress: '0xfrom',
    toAddress: '0xto',
    sending: {
      chainId,
      txHash: '0xhash',
      txLink: '',
      amount,
      amountUSD: '0',
      value,
      token: asToken(token, chainId),
      gasToken: asToken(gasToken, chainId),
      gasAmount: '0',
      gasAmountUSD: '0',
      gasPrice: '0',
      gasUsed: '0',
      timestamp: 1,
    },
    receiving: {
      chainId: 1,
      txHash: '0xhash2',
      txLink: '',
      amount: '1',
      token: asToken(ETH, 1),
    },
    feeCosts,
  }) as unknown as FullStatusData

const getProviderFee = (transfer: TestTransfer, fromChain?: ExtendedChain) => {
  const routeExecution = buildRouteFromTxHistory(
    buildTransfer(transfer),
    undefined,
    fromChain
  )
  const { feeCosts, feeCostUSD } = getAccumulatedFeeCostsBreakdown(
    routeExecution!.route
  )
  const feeAmounts = routeExecution!.route.steps[0].execution?.feeCosts
    ?.filter((feeCost) => feeCost.included === false)
    .map((feeCost) => feeCost.amount)
  return { feeCosts, feeCostUSD, feeAmounts }
}

describe('buildRouteFromTxHistory provider fee', () => {
  // 3NdmzBAT6xwY9bCfteX9FGTNV8zcggUXg9Wk9v6uNZ1cpAPLhV6CuPz99DhTYn8HGpJHz2CUDYax1nn4CzdAziog
  it('should show the non-included fee of a native SOL send with value 0', () => {
    const chainId = 1151111081099710
    const { feeCosts, feeCostUSD, feeAmounts } = getProviderFee({
      chainId,
      value: '0',
      amount: '211915239',
      token: SOL,
      feeCosts: [
        fee(chainId, SOL, '42000', true, 'LIFI Fixed Fee'),
        fee(chainId, SOL, '1488440', false, 'Rent Exemption Deposit'),
      ],
    })

    expect(feeCosts).toHaveLength(1)
    expect(feeAmounts).toEqual(['1488440'])
    expect(feeCostUSD).toBeCloseTo(0.1555, 4)
  })

  it.each([
    // 59ufRe24FR2ifZvSTAi7TWgBmCCbM91evg8XyA8kGf5G
    {
      ecosystem: 'Sui',
      chainId: 9270000000000000,
      amount: '5338932000',
      token: {
        address:
          '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
        symbol: 'SUI',
        decimals: 9,
        priceUSD: '1.010',
      },
      lifiFee: '1068000',
    },
    // d79bf3d061409bc28ad6857b1315187eaff724d4aecb3bf83a00192f81949526
    {
      ecosystem: 'Stellar',
      chainId: 1201081091099710,
      amount: '499750000000',
      token: {
        address: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
        symbol: 'XLM',
        decimals: 7,
        priceUSD: '0.17741',
      },
      lifiFee: '250000000',
    },
    // 0x939e815808975e41e3a169df034451997b569dc60227d861a1c716336d475879
    {
      ecosystem: 'EVM',
      chainId: 1,
      amount: '450000000000000',
      token: ETH,
      lifiFee: '90000000000',
    },
  ])(
    'should show no provider fee for a native $ecosystem send with value 0',
    ({ chainId, amount, token, lifiFee }) => {
      const { feeCosts, feeCostUSD, feeAmounts } = getProviderFee({
        chainId,
        value: '0',
        amount,
        token,
        feeCosts: [fee(chainId, token, lifiFee, true, 'LIFI Fixed Fee')],
      })

      expect(feeCosts).toEqual([])
      expect(feeAmounts).toBeUndefined()
      expect(feeCostUSD).toBe(0)
    }
  )

  describe('native Stargate send', () => {
    // 0x6861dba4d82448bce29b07608b84597a7fd2c8b0628b1636beaabaaa4fdb819b
    const chainId = 1625
    const G: TestToken = {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'G',
      decimals: 18,
      priceUSD: '0.00371',
    }
    const transfer = {
      chainId,
      value: '200619385198882794178',
      amount: '170000000000000000000',
      token: G,
    }

    it('should show the fee from value when feeCosts lists only included fees', () => {
      const { feeCosts, feeCostUSD, feeAmounts } = getProviderFee({
        ...transfer,
        feeCosts: [
          fee(chainId, G, '85000000000000000', true, 'LIFI Fixed Fee'),
        ],
      })

      expect(feeCosts).toHaveLength(1)
      expect(feeAmounts).toEqual(['30619385198882794178'])
      expect(feeCostUSD).toBeCloseTo(0.1136, 4)
    })

    it('should show the non-included fee once when value holds the same fee', () => {
      const { feeCosts, feeCostUSD, feeAmounts } = getProviderFee({
        ...transfer,
        feeCosts: [
          fee(chainId, G, '85000000000000000', true, 'LIFI Fixed Fee'),
          fee(
            chainId,
            G,
            '30619385198882794178',
            false,
            'LayerZero native fee'
          ),
        ],
      })

      expect(feeCosts).toHaveLength(1)
      expect(feeAmounts).toEqual(['30619385198882794178'])
      expect(feeCostUSD).toBeCloseTo(0.1136, 4)
    })
  })

  // 0xc9c88de22ffd6949ac78a2995a0258fcd854d334a134f8deb82ddcf61b1660dc
  it('should show a non-included native fee of an ERC20 send with value 0', () => {
    const { feeCosts, feeCostUSD, feeAmounts } = getProviderFee({
      chainId: 1,
      value: '0',
      amount: '1400000000',
      token: {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        symbol: 'USDT',
        decimals: 6,
        priceUSD: '0.9960963509',
      },
      gasToken: ETH,
      feeCosts: [fee(1, ETH, '4407208926200', false, 'Bridge Fee')],
    })

    expect(feeCosts).toHaveLength(1)
    expect(feeCostUSD).toBeCloseTo(0.01076, 5)
    expect(feeAmounts).toEqual(['4407208926200'])
  })

  // 0xe2e967a68baa25f004b85ba449732c571e7ec450218e5282d08356103fda3141
  it('should show value as the fee of an ERC20 send without non-included fees', () => {
    const chainId = 2741
    const PENGU: TestToken = {
      address: '0x9eBe3A824Ca958e4b3Da772D2065518F009CBa62',
      symbol: 'PENGU',
      decimals: 18,
      priceUSD: '0.007462436009',
    }
    const { feeCosts, feeCostUSD, feeAmounts } = getProviderFee({
      chainId,
      value: '670301340707218',
      amount: '2992434293000000000000',
      token: PENGU,
      gasToken: { ...ETH, priceUSD: '2430.36' },
      feeCosts: [
        fee(chainId, PENGU, '1496217146500000000', true, 'LIFI Fixed Fee'),
      ],
    })

    expect(feeCosts).toHaveLength(1)
    expect(feeAmounts).toEqual(['670301340707218'])
    expect(feeCostUSD).toBeCloseTo(1.629, 3)
  })

  // 45gRZMKn9s9uUZvGKr2zeaj9sigEKgjJECtsUns5dHeJv3vsMuwLxi6YkGBiRiBwdTrCcroLVmqdbn1iWotpjL5T
  it('should show the GasZip fee of a Solana token send', () => {
    const chainId = 1151111081099710
    const USDC: TestToken = {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      symbol: 'USDC',
      decimals: 6,
      priceUSD: '0.9978451107',
    }
    const gasToken = { ...SOL, priceUSD: '105.76443898535089' }
    const { feeCosts, feeCostUSD, feeAmounts } = getProviderFee({
      chainId,
      value: '0',
      amount: '686926428',
      token: USDC,
      gasToken,
      feeCosts: [
        fee(chainId, gasToken, '625000', false, 'GasZip gas fee'),
        fee(chainId, USDC, '4059', true, 'Relayer Gas fee'),
        fee(chainId, USDC, '174560', true, 'Relayer Service fee'),
      ],
    })

    expect(feeCosts).toHaveLength(1)
    expect(feeAmounts).toEqual(['625000'])
    expect(feeCostUSD).toBeCloseTo(0.0661, 4)
  })

  // 8f40ea3dbf81818bb49c5e7250ee1663e433249d990e138482e695cd9cc9585a
  it('should show no provider fee for a Bitcoin send with value equal to amount', () => {
    const chainId = 20000000000001
    const BTC: TestToken = {
      address: 'bitcoin',
      symbol: 'BTC',
      decimals: 8,
      priceUSD: '82850.91125939877',
    }
    const { feeCosts, feeAmounts } = getProviderFee({
      chainId,
      value: '23914',
      amount: '23914',
      token: BTC,
      feeCosts: [fee(chainId, BTC, '4', true, 'LIFI Fixed Fee')],
    })

    expect(feeCosts).toEqual([])
    expect(feeAmounts).toBeUndefined()
  })

  // 0x62f3198dc97db6e253cc190f773d97853077e158b2142da8d95c65086f6baa8e
  it('should not show value as a fee on a chain with non-standard native decimals', () => {
    const chainId = 5042
    const USDC: TestToken = {
      address: '0x3600000000000000000000000000000000000000',
      symbol: 'USDC',
      decimals: 6,
      priceUSD: '1.001001001001001',
    }
    const { feeCosts, feeAmounts } = getProviderFee(
      {
        chainId,
        value: '3736182000000000000',
        amount: '3736182',
        token: USDC,
        gasToken: { ...USDC, address: ETH.address, decimals: 18 },
        feeCosts: [fee(chainId, USDC, '747', true, 'LIFI Fixed Fee')],
      },
      { id: chainId, nonStandardNativeDecimals: true } as ExtendedChain
    )

    expect(feeCosts).toEqual([])
    expect(feeAmounts).toBeUndefined()
  })

  it('should use value when a fee does not say that it is non-included', () => {
    const { feeCosts, feeAmounts } = getProviderFee({
      chainId: 1,
      value: '1500',
      amount: '1000',
      token: ETH,
      feeCosts: [fee(1, ETH, '700', undefined)],
    })

    expect(feeCosts).toHaveLength(1)
    expect(feeAmounts).toEqual(['500'])
  })

  it('should ignore fees without a token or with an unparseable amount', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { feeCosts, feeAmounts } = getProviderFee({
      chainId: 1,
      value: '0',
      amount: '1000',
      token: ETH,
      feeCosts: [
        { name: 'No token', amount: '100', included: false },
        fee(1, ETH, '1e18', false, 'Exponent'),
        fee(1, ETH, '-5', false, 'Negative'),
        fee(1, ETH, '0', false, 'Zero'),
      ],
    })

    expect(feeCosts).toEqual([])
    expect(feeAmounts).toBeUndefined()
    warn.mockRestore()
  })
})
