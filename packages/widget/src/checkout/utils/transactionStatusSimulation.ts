import type { StatusResponse } from '@lifi/sdk'

/**
 * Dev-only fixtures that let the transaction status page render each phase
 * without an actual on-ramp transfer. Activated via `?simulateTransactionStatus=`
 * query param on the status route.
 */
export const transactionStatusSimulationKinds = [
  'watching',
  'pending',
  'done',
  'failed',
] as const

export type TransactionStatusSimulationKind =
  (typeof transactionStatusSimulationKinds)[number]

// Bundlers (Vite/tsdown/Rollup) replace this at build time, so the simulation
// helpers below dead-code-eliminate in production consumer bundles.
const isDevSimulationEnabled = process.env.NODE_ENV !== 'production'

export function isTransactionStatusSimulationKind(
  value: string | null | undefined
): value is TransactionStatusSimulationKind {
  if (!isDevSimulationEnabled) {
    return false
  }
  return (
    typeof value === 'string' &&
    (transactionStatusSimulationKinds as readonly string[]).includes(value)
  )
}

const usdt = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  chainId: 1,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  coinKey: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  priceUSD: '0.999525',
}

const eth = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 1,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  coinKey: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  priceUSD: '2359.65',
}

const baseFixture = {
  transactionId:
    '0x66cce2e5e81b64e159eaca64173948578a83b1d1615aa3c680ea3135db0849ad',
  fromAddress: '0x74890864d2a135b98eae5f90c5e6bf96c7283929',
  toAddress: '0x74890864d2a135b98eae5f90c5e6bf96c7283929',
  tool: 'sushiswap',
  status: 'DONE',
  substatus: 'COMPLETED',
  substatusMessage: 'The transfer is complete.',
  sending: {
    txHash:
      '0xed295238d734db823a5d2791fd2e55afa2b398ab66d8ec55e4be09b2ee6eec1c',
    txLink:
      'https://etherscan.io/tx/0xed295238d734db823a5d2791fd2e55afa2b398ab66d8ec55e4be09b2ee6eec1c',
    chainId: 1,
    amount: '5000695096',
    amountUSD: '4998.3198',
    gasAmountUSD: '1.4566',
    timestamp: Math.floor(Date.now() / 1000),
    token: usdt,
    includedSteps: [
      {
        tool: 'feeCollection',
        toolDetails: {
          key: 'feeCollection',
          name: 'Integrator Fee',
          logoURI:
            'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/protocols/feeCollection.svg',
        },
        fromAmount: '5000695096',
        fromToken: usdt,
        toAmount: '4950688146',
        toToken: usdt,
      },
      {
        tool: 'sushiswap',
        toolDetails: {
          key: 'sushiswap',
          name: 'SushiSwap Aggregator',
          logoURI:
            'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/sushi.svg',
        },
        fromAmount: '4950688146',
        fromToken: usdt,
        toAmount: '2097405759475624450',
        toToken: eth,
      },
    ],
  },
  receiving: {
    txHash:
      '0xed295238d734db823a5d2791fd2e55afa2b398ab66d8ec55e4be09b2ee6eec1c',
    txLink:
      'https://etherscan.io/tx/0xed295238d734db823a5d2791fd2e55afa2b398ab66d8ec55e4be09b2ee6eec1c',
    chainId: 1,
    amount: '2097405759475624450',
    amountUSD: '4949.14',
    timestamp: Math.floor(Date.now() / 1000),
    token: eth,
  },
  feeCosts: [],
  lifiExplorerLink:
    'https://explorer.li.fi/tx/0xed295238d734db823a5d2791fd2e55afa2b398ab66d8ec55e4be09b2ee6eec1c',
  metadata: { integrator: 'simulated' },
} as unknown as StatusResponse

export function getSimulatedStatus(
  kind: TransactionStatusSimulationKind
): StatusResponse | undefined {
  if (!isDevSimulationEnabled) {
    return undefined
  }
  if (kind === 'watching') {
    return undefined
  }
  if (kind === 'pending') {
    return {
      ...baseFixture,
      status: 'PENDING',
      substatus: 'WAIT_DESTINATION_TRANSACTION',
      substatusMessage: 'Waiting for the destination transaction.',
      receiving: {
        chainId: 1,
        token: eth,
      },
    } as unknown as StatusResponse
  }
  if (kind === 'failed') {
    return {
      ...baseFixture,
      status: 'FAILED',
      substatus: 'UNKNOWN_ERROR',
      substatusMessage: 'The transfer failed. Please contact support.',
    } as unknown as StatusResponse
  }
  return baseFixture
}
