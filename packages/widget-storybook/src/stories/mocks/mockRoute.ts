import type { RouteExtended } from '@lifi/sdk'
import { RouteExecutionStatus } from '@lifi/widget/src/stores/routes/types'

// ── Token fixtures ──────────────────────────────────────────────────────────
// Complete token data including priceUSD + logoURI so the Token component
// renders TokenBase directly (no fallback path, no network calls).

const USDC = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  chainId: 1,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  priceUSD: '1.00',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
}

const ETH_ON_ARB = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 42161,
  symbol: 'ETH',
  decimals: 18,
  name: 'Ethereum',
  priceUSD: '3500.00',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
}

const ETH_ON_ETH = {
  ...ETH_ON_ARB,
  chainId: 1,
}

// ── Route factory ───────────────────────────────────────────────────────────
// Creates a RouteExtended for a USDC (Ethereum) → ETH (Arbitrum) bridge.
// The execution state varies based on the status parameter.

interface MockRouteOptions {
  status: RouteExecutionStatus
  /** Which execution actions are present and their statuses. */
  actions?: Array<{
    type: string
    status: 'PENDING' | 'ACTION_REQUIRED' | 'DONE' | 'FAILED'
    txHash?: string
  }>
}

export function createMockRoute({
  status,
  actions = [],
}: MockRouteOptions): RouteExtended {
  const isDone =
    (status & RouteExecutionStatus.Done) === RouteExecutionStatus.Done
  const isFailed =
    (status & RouteExecutionStatus.Failed) === RouteExecutionStatus.Failed

  const executionStatus = isDone
    ? 'DONE'
    : isFailed
      ? 'FAILED'
      : actions.at(-1)?.status === 'ACTION_REQUIRED'
        ? 'ACTION_REQUIRED'
        : 'PENDING'

  return {
    id: 'mock-route-001',
    fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    fromChainId: 1,
    toChainId: 42161,
    fromToken: { ...USDC, amount: BigInt('100000000') },
    toToken: { ...ETH_ON_ARB, amount: BigInt('28571428571428571') },
    fromAmount: '100000000',
    fromAmountUSD: '100.00',
    toAmount: '28571428571428571',
    toAmountMin: '28000000000000000',
    toAmountUSD: '99.75',
    gasCostUSD: '2.50',
    insurance: { state: 'NOT_INSURABLE', feeAmountUsd: '0' },
    steps: [
      {
        id: 'step-1',
        type: 'lifi',
        tool: 'stargate',
        toolDetails: {
          key: 'stargate',
          name: 'Stargate',
          logoURI:
            'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/bridges/stargate.png',
        },
        action: {
          fromToken: USDC,
          fromAmount: '100000000',
          fromChainId: 1,
          fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          toToken: ETH_ON_ARB,
          toChainId: 42161,
          toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          slippage: 0.005,
        },
        estimate: {
          tool: 'stargate',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          fromAmount: '100000000',
          fromAmountUSD: '100.00',
          toAmount: '28571428571428571',
          toAmountMin: '28000000000000000',
          toAmountUSD: '99.75',
          executionDuration: 120,
        },
        includedSteps: [
          {
            id: 'step-1-swap',
            type: 'swap',
            action: {
              fromChainId: 1,
              fromAmount: '100000000',
              fromToken: USDC,
              toChainId: 1,
              toToken: ETH_ON_ETH,
              slippage: 0.005,
              fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
              toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
            },
            estimate: {
              tool: 'stargate',
              fromAmount: '100000000',
              toAmount: '28571428571428571',
              toAmountMin: '28000000000000000',
              approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              executionDuration: 30,
            },
            tool: 'stargate',
            toolDetails: {
              key: 'stargate',
              name: 'Stargate',
              logoURI:
                'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/bridges/stargate.png',
            },
          },
        ],
        integrator: 'lifi-storybook',
        execution: {
          status: executionStatus,
          startedAt: Date.now() - 60_000,
          signedAt:
            executionStatus !== 'ACTION_REQUIRED'
              ? Date.now() - 55_000
              : undefined,
          fromAmount: '100000000',
          toAmount: isDone ? '28571428571428571' : undefined,
          toToken: isDone ? ETH_ON_ARB : undefined,
          actions: actions.map((a, i) => ({
            type: a.type,
            status: a.status,
            message: '',
            chainId: a.type === 'RECEIVING_CHAIN' ? 42161 : 1,
            txHash:
              a.txHash ??
              (a.status === 'DONE' || a.status === 'FAILED'
                ? `0x${String(i).padStart(64, 'a')}`
                : undefined),
            txLink: undefined,
            ...(a.status === 'DONE' || a.status === 'FAILED'
              ? {
                  substatus:
                    a.status === 'DONE' ? 'COMPLETED' : 'UNKNOWN_ERROR',
                  substatusMessage: '',
                }
              : {}),
          })),
          gasCosts: [
            {
              amount: '2500000000000000',
              amountUSD: '2.50',
              token: ETH_ON_ETH,
              estimate: '0',
              limit: '0',
              price: '0',
              type: 'SEND',
            },
          ],
        },
      },
    ],
  } as RouteExtended
}

// ── Pre-built scenarios ─────────────────────────────────────────────────────
// Each scenario represents a point in the execution lifecycle.

const { Pending, Done, Failed, Partial, Refunded } = RouteExecutionStatus

// Each config creates a fresh route on access so Date.now() timestamps
// are always current (timers won't expire from stale module-load values).
//
// Production behavior: the checklist only ACCUMULATES. Each state carries
// forward all prior completed actions — rows are only added, never swapped.
// This is what makes positional keys stable across transitions.
const configs: Record<string, MockRouteOptions> = {
  pendingAllowance: {
    status: Pending,
    actions: [{ type: 'SET_ALLOWANCE', status: 'ACTION_REQUIRED' }],
  },
  pendingSwapSign: {
    status: Pending,
    actions: [
      { type: 'SET_ALLOWANCE', status: 'DONE' },
      { type: 'SWAP', status: 'ACTION_REQUIRED' },
    ],
  },
  pendingSwap: {
    status: Pending,
    actions: [
      { type: 'SET_ALLOWANCE', status: 'DONE' },
      { type: 'SWAP', status: 'PENDING' },
    ],
  },
  pendingBridge: {
    status: Pending,
    actions: [
      { type: 'SET_ALLOWANCE', status: 'DONE' },
      { type: 'SWAP', status: 'DONE' },
      { type: 'CROSS_CHAIN', status: 'PENDING' },
    ],
  },
  pendingReceiving: {
    status: Pending,
    actions: [
      { type: 'SET_ALLOWANCE', status: 'DONE' },
      { type: 'SWAP', status: 'DONE' },
      { type: 'CROSS_CHAIN', status: 'DONE' },
      { type: 'RECEIVING_CHAIN', status: 'PENDING' },
    ],
  },
  done: {
    status: Done,
    actions: [
      { type: 'SET_ALLOWANCE', status: 'DONE' },
      { type: 'SWAP', status: 'DONE' },
      { type: 'CROSS_CHAIN', status: 'DONE' },
      { type: 'RECEIVING_CHAIN', status: 'DONE' },
    ],
  },
  donePartial: {
    status: (Done | Partial) as RouteExecutionStatus,
    actions: [
      { type: 'SET_ALLOWANCE', status: 'DONE' },
      { type: 'SWAP', status: 'DONE' },
      { type: 'CROSS_CHAIN', status: 'DONE' },
    ],
  },
  doneRefunded: {
    status: (Done | Refunded) as RouteExecutionStatus,
    actions: [
      { type: 'SET_ALLOWANCE', status: 'DONE' },
      { type: 'SWAP', status: 'DONE' },
      { type: 'CROSS_CHAIN', status: 'DONE' },
    ],
  },
  failed: {
    // All transactions featured — failure is ADDED at the end.
    // Worst case: everything succeeded, receiving chain failed last.
    status: Failed,
    actions: [
      { type: 'SET_ALLOWANCE', status: 'DONE' },
      { type: 'SWAP', status: 'DONE' },
      { type: 'CROSS_CHAIN', status: 'DONE' },
      { type: 'RECEIVING_CHAIN', status: 'FAILED' },
    ],
  },
}

export type MockRouteKey =
  | 'pendingAllowance'
  | 'pendingSwapSign'
  | 'pendingSwap'
  | 'pendingBridge'
  | 'pendingReceiving'
  | 'done'
  | 'donePartial'
  | 'doneRefunded'
  | 'failed'

type MockRoutes = Record<MockRouteKey, RouteExtended>

// Proxy creates fresh routes on every access so timestamps are always current.
export const mockRoutes: MockRoutes = new Proxy({} as MockRoutes, {
  get(_target, prop: string) {
    const config = configs[prop]
    return config ? createMockRoute(config) : undefined
  },
})
