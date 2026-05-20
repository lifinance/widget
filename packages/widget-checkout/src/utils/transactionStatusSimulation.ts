import type { StatusResponse, Substatus } from '@lifi/sdk'
import type { OnRampFailureKind } from '@lifi/widget-provider/checkout'
import type { CheckoutFundingSource } from '../stores/useCheckoutFlowStore.js'

export const transactionStatusSimulationKinds = [
  'watching',
  'pending',
  'done',
  'failed',
] as const

export type TransactionStatusSimulationKind =
  (typeof transactionStatusSimulationKinds)[number]

const onRampFailureKinds: readonly OnRampFailureKind[] = [
  'connection',
  'withdrawal',
  'cancelled',
  'unavailable',
]

const fundingSources: readonly CheckoutFundingSource[] = [
  'wallet',
  'transfer',
  'exchange',
  'cash',
]

// Bundlers (Vite/tsdown/Rollup) replace this at build time, so the simulation
// helpers below dead-code-eliminate in production consumer bundles.
const isDevSimulationEnabled = process.env.NODE_ENV !== 'production'

// All window-level dev simulation params written by CheckoutSimulationPanel.
// Listed here so the normal flow can scrub leftover state when the user
// navigates outside the panel.
export const SIM_WINDOW_PARAM_KEYS = [
  'mockDepositAddress',
  'simulatePendingDuration',
  'simulateWatchingDuration',
  'simulateTransferReceipt',
  'simulateTransferReceiptAfter',
  'simulateSubstatus',
  'simulateOnRampFailure',
  'simulateFundingSource',
] as const

export function clearSimWindowParams(): void {
  if (!isDevSimulationEnabled || typeof window === 'undefined') {
    return
  }
  const url = new URL(window.location.href)
  let changed = false
  for (const key of SIM_WINDOW_PARAM_KEYS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key)
      changed = true
    }
  }
  if (changed) {
    window.history.replaceState({}, '', url.toString())
  }
}

export function getMockDepositAddress(): string | null {
  if (!isDevSimulationEnabled) {
    return null
  }
  if (typeof window === 'undefined') {
    return null
  }
  const value = new URLSearchParams(window.location.search).get(
    'mockDepositAddress'
  )
  return value && value.length > 0 ? value : null
}

const DEFAULT_WATCHING_DURATION_MS = 5_000

export function getWatchingSimulationDuration(): number | null {
  if (!isDevSimulationEnabled) {
    return null
  }
  if (typeof window === 'undefined') {
    return null
  }
  const raw = new URLSearchParams(window.location.search).get(
    'simulateWatchingDuration'
  )
  if (raw === null) {
    return DEFAULT_WATCHING_DURATION_MS
  }
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_WATCHING_DURATION_MS
}

const DEFAULT_PENDING_DURATION_MS = 4_000

export function getPendingSimulationDuration(): number | null {
  if (!isDevSimulationEnabled) {
    return null
  }
  if (typeof window === 'undefined') {
    return null
  }
  const raw = new URLSearchParams(window.location.search).get(
    'simulatePendingDuration'
  )
  if (raw === null) {
    return DEFAULT_PENDING_DURATION_MS
  }
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_PENDING_DURATION_MS
}

const DEFAULT_TRANSFER_RECEIPT_DELAY_MS = 5_000

export function getTransferReceiptSimulation(): {
  kind: TransactionStatusSimulationKind
  delayMs: number
} | null {
  if (!isDevSimulationEnabled) {
    return null
  }
  if (typeof window === 'undefined') {
    return null
  }
  const params = new URLSearchParams(window.location.search)
  const kind = params.get('simulateTransferReceipt')
  if (!isTransactionStatusSimulationKind(kind)) {
    return null
  }
  const after = Number.parseInt(
    params.get('simulateTransferReceiptAfter') ?? '',
    10
  )
  const delayMs =
    Number.isFinite(after) && after >= 0
      ? after
      : DEFAULT_TRANSFER_RECEIPT_DELAY_MS
  return { kind, delayMs }
}

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

export function getSimulatedSubstatus(): Substatus | null {
  if (!isDevSimulationEnabled || typeof window === 'undefined') {
    return null
  }
  const value = new URLSearchParams(window.location.search).get(
    'simulateSubstatus'
  )
  return value && value.length > 0 ? (value as Substatus) : null
}

export function getSimulatedOnRampFailure(): OnRampFailureKind | null {
  if (!isDevSimulationEnabled || typeof window === 'undefined') {
    return null
  }
  const value = new URLSearchParams(window.location.search).get(
    'simulateOnRampFailure'
  )
  return value && (onRampFailureKinds as readonly string[]).includes(value)
    ? (value as OnRampFailureKind)
    : null
}

export function getSimulatedFundingSource(): CheckoutFundingSource | null {
  if (!isDevSimulationEnabled || typeof window === 'undefined') {
    return null
  }
  const value = new URLSearchParams(window.location.search).get(
    'simulateFundingSource'
  )
  return value && (fundingSources as readonly string[]).includes(value)
    ? (value as CheckoutFundingSource)
    : null
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
  kind: TransactionStatusSimulationKind,
  substatusOverride?: Substatus | null
): StatusResponse | undefined {
  if (!isDevSimulationEnabled) {
    return undefined
  }
  if (kind === 'watching') {
    return undefined
  }
  // When an explicit substatus is provided, clear substatusMessage so the
  // variant's i18n descriptionKey drives the copy (otherwise the fixture
  // message overrides it and the variant isn't visually testable).
  const applyOverride = (fixture: StatusResponse): StatusResponse =>
    substatusOverride
      ? ({
          ...fixture,
          substatus: substatusOverride,
          substatusMessage: undefined,
        } as unknown as StatusResponse)
      : fixture

  if (kind === 'pending') {
    return applyOverride({
      ...baseFixture,
      status: 'PENDING',
      substatus: 'WAIT_DESTINATION_TRANSACTION',
      substatusMessage: 'Waiting for the destination transaction.',
      receiving: {
        chainId: 1,
        token: eth,
      },
    } as unknown as StatusResponse)
  }
  if (kind === 'failed') {
    return applyOverride({
      ...baseFixture,
      status: 'FAILED',
      substatus: 'UNKNOWN_ERROR',
      substatusMessage: 'The transfer failed. Please contact support.',
    } as unknown as StatusResponse)
  }
  return applyOverride(baseFixture)
}
