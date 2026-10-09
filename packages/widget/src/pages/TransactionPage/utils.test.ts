import {
  type Execution,
  LiFiErrorCode,
  type LiFiStepExtended,
  type RouteExtended,
} from '@lifi/sdk'
import { describe, expect, it, vi } from 'vitest'
import {
  canStartNewSwap,
  getNewSwapFormValues,
  getRetryGates,
  getStartGates,
  isCallBundleNotFound,
  nextGate,
  openNextGate,
} from './utils.js'

const addressClear = {
  toAddress: '0xabc',
  hasActivity: true,
  isLoadingAddressActivity: false,
  isActivityAddressFetched: true,
  confirmationHidden: false,
}
const addressNeeded = { ...addressClear, hasActivity: false }

describe('nextGate', () => {
  const gates = [
    ['a', true],
    ['b', false],
    ['c', true],
  ] as const

  it('should return the first gate that is needed', () => {
    expect(nextGate(gates)).toBe('a')
  })

  it('should skip gates that are not needed', () => {
    expect(nextGate(gates, 'a')).toBe('c')
  })

  it('should return undefined after the last needed gate', () => {
    expect(nextGate(gates, 'c')).toBeUndefined()
  })

  it('should return undefined when no gate is needed', () => {
    expect(nextGate([['a', false]] as const)).toBeUndefined()
  })

  it('should return undefined for a gate that is not in the list', () => {
    expect(nextGate(gates, 'z' as 'a')).toBeUndefined()
  })
})

describe('openNextGate', () => {
  it('should open the next needed gate and not finish', () => {
    const open = { a: vi.fn(), b: vi.fn() }
    const done = vi.fn()
    openNextGate(
      [
        ['a', true],
        ['b', true],
      ] as const,
      open,
      done
    )
    expect(open.a).toHaveBeenCalledOnce()
    expect(open.b).not.toHaveBeenCalled()
    expect(done).not.toHaveBeenCalled()
  })

  it('should finish when no gate is left', () => {
    const open = { a: vi.fn() }
    const done = vi.fn()
    openNextGate([['a', false]] as const, open, done)
    expect(open.a).not.toHaveBeenCalled()
    expect(done).toHaveBeenCalledOnce()
  })
})

describe('getRetryGates', () => {
  const base = {
    ...addressClear,
    valueLossExceeded: false,
    isCustomMode: false,
  }

  it('should order the address gate before the value gate', () => {
    expect(getRetryGates(base).map(([gate]) => gate)).toEqual([
      'address',
      'value',
    ])
  })

  it('should need the address gate only for an unused address', () => {
    expect(getRetryGates(base)[0][1]).toBe(false)
    expect(getRetryGates({ ...base, ...addressNeeded })[0][1]).toBe(true)
  })

  it('should not need the address gate while activity is still loading', () => {
    const loading = {
      ...base,
      ...addressNeeded,
      isLoadingAddressActivity: true,
    }
    expect(getRetryGates(loading)[0][1]).toBe(false)
  })

  it('should not need the address gate when the confirmation is hidden', () => {
    const hidden = { ...base, ...addressNeeded, confirmationHidden: true }
    expect(getRetryGates(hidden)[0][1]).toBe(false)
  })

  it('should not need the value gate in custom mode', () => {
    const custom = { ...base, valueLossExceeded: true, isCustomMode: true }
    expect(getRetryGates(custom)[1][1]).toBe(false)
    expect(getRetryGates({ ...base, valueLossExceeded: true })[1][1]).toBe(true)
  })
})

describe('getStartGates', () => {
  const base = {
    ...addressClear,
    flaggedTokenCount: 0,
    valueLossExceeded: false,
    isCustomMode: false,
  }

  it('should warn about a flagged token before anything else', () => {
    expect(getStartGates(base).map(([gate]) => gate)).toEqual([
      'flagged',
      'address',
      'value',
    ])
  })

  it('should need the flagged gate for any flagged token', () => {
    expect(getStartGates(base)[0][1]).toBe(false)
    expect(getStartGates({ ...base, flaggedTokenCount: 1 })[0][1]).toBe(true)
  })

  it('should still warn about a flagged token in custom mode', () => {
    const custom = { ...base, flaggedTokenCount: 1, isCustomMode: true }
    expect(getStartGates(custom)[0][1]).toBe(true)
  })

  it('should not need the value gate in custom mode', () => {
    const custom = { ...base, valueLossExceeded: true, isCustomMode: true }
    expect(getStartGates(custom)[2][1]).toBe(false)
  })
})

const SENDER = '0x1111111111111111111111111111111111111111'
const RECEIVER = '0x2222222222222222222222222222222222222222'

const failedExecution = (
  code: number = LiFiErrorCode.CallBundleNotFound
): Execution => ({
  status: 'FAILED',
  startedAt: 0,
  actions: [
    {
      type: 'SWAP',
      status: 'FAILED',
      taskId: '0xbundle',
      error: { code, message: 'This bundle id is unknown' },
    },
  ],
})

const doneExecution: Execution = {
  status: 'DONE',
  startedAt: 0,
  actions: [{ type: 'SWAP', status: 'DONE', txHash: '0xhash' }],
}

const step = (
  fromChainId: number,
  toChainId: number,
  execution?: Execution,
  toAddress = SENDER
): LiFiStepExtended =>
  ({
    id: `${fromChainId}-${toChainId}`,
    action: {
      fromChainId,
      fromAmount: '1500000',
      fromToken: { address: `0xfrom${fromChainId}`, decimals: 6 },
      fromAddress: SENDER,
      toChainId,
      toToken: { address: `0xto${toChainId}`, decimals: 18 },
      toAddress,
    },
    execution,
  }) as LiFiStepExtended

const route = (...steps: LiFiStepExtended[]): RouteExtended => {
  const { action: first } = steps[0]
  const { action: last } = steps.at(-1)!
  return {
    fromChainId: first.fromChainId,
    fromToken: first.fromToken,
    fromAmount: first.fromAmount,
    fromAddress: first.fromAddress,
    toChainId: last.toChainId,
    toToken: last.toToken,
    toAddress: last.toAddress,
    steps,
  } as RouteExtended
}

describe('isCallBundleNotFound', () => {
  it('should find the error on the failed action', () => {
    expect(isCallBundleNotFound(route(step(1, 8453, failedExecution())))).toBe(
      true
    )
  })

  it('should find the error that the failed step holds itself', () => {
    const execution: Execution = {
      status: 'FAILED',
      startedAt: 0,
      actions: [],
      error: { code: LiFiErrorCode.CallBundleNotFound, message: '' },
    }
    expect(isCallBundleNotFound(route(step(1, 8453, execution)))).toBe(true)
  })

  it('should find the error when a later step failed', () => {
    const later = route(
      step(1, 1, doneExecution),
      step(1, 8453, failedExecution())
    )
    expect(isCallBundleNotFound(later)).toBe(true)
  })

  it('should not find the error for other errors', () => {
    for (const code of [
      LiFiErrorCode.SignatureRejected,
      LiFiErrorCode.TransactionRejected,
      LiFiErrorCode.TransactionFailed,
    ]) {
      expect(
        isCallBundleNotFound(route(step(1, 8453, failedExecution(code))))
      ).toBe(false)
    }
  })

  it('should not find the error for a route that did not fail', () => {
    expect(isCallBundleNotFound(route(step(1, 8453, doneExecution)))).toBe(
      false
    )
    expect(isCallBundleNotFound(route(step(1, 8453)))).toBe(false)
  })
})

describe('canStartNewSwap', () => {
  const base = { mode: 'default' as const, swapOnly: false }

  it('should offer a new swap when the wallet has no record of the first step', () => {
    expect(
      canStartNewSwap({
        ...base,
        route: route(step(1, 8453, failedExecution())),
      })
    ).toBe(true)
  })

  it('should offer a new swap when the failed step holds the error itself', () => {
    const execution: Execution = {
      status: 'FAILED',
      startedAt: 0,
      actions: [],
      error: { code: LiFiErrorCode.CallBundleNotFound, message: '' },
    }
    expect(
      canStartNewSwap({ ...base, route: route(step(1, 8453, execution)) })
    ).toBe(true)
  })

  it('should not offer a new swap for other errors', () => {
    for (const code of [
      LiFiErrorCode.SignatureRejected,
      LiFiErrorCode.TransactionRejected,
      LiFiErrorCode.TransactionFailed,
    ]) {
      expect(
        canStartNewSwap({
          ...base,
          route: route(step(1, 8453, failedExecution(code))),
        })
      ).toBe(false)
    }
  })

  it('should not offer a new swap for a route that did not fail', () => {
    expect(
      canStartNewSwap({ ...base, route: route(step(1, 8453, doneExecution)) })
    ).toBe(false)
  })

  it('should not offer a new swap when a later step failed', () => {
    const later = route(
      step(1, 1, doneExecution),
      step(1, 8453, failedExecution())
    )
    expect(canStartNewSwap({ ...base, route: later })).toBe(false)
  })

  it('should not offer a new swap when a later step failed before the first step started', () => {
    const laterFailed = route(step(1, 1), step(1, 8453, failedExecution()))
    expect(canStartNewSwap({ ...base, route: laterFailed })).toBe(false)
  })

  it('should not offer a new swap when another step has executed actions', () => {
    const executedLater = route(
      step(1, 1, failedExecution()),
      step(1, 8453, doneExecution)
    )
    expect(canStartNewSwap({ ...base, route: executedLater })).toBe(false)
  })

  it('should offer a new swap when the later steps have not started', () => {
    const notStarted = route(step(1, 1, failedExecution()), step(1, 8453))
    expect(canStartNewSwap({ ...base, route: notStarted })).toBe(true)
  })

  it('should offer a new swap in the modes with the plain swap form', () => {
    const failed = route(step(1, 8453, failedExecution()))
    for (const mode of [undefined, 'default', 'split'] as const) {
      expect(canStartNewSwap({ ...base, mode, route: failed })).toBe(true)
    }
  })

  it('should not offer a new swap in modes that replace the swap form', () => {
    const failed = route(step(1, 8453, failedExecution()))
    for (const mode of ['custom', 'refuel', 'limit'] as const) {
      expect(canStartNewSwap({ ...base, mode, route: failed })).toBe(false)
    }
  })

  it('should not offer a cross-chain swap to a swap-only form', () => {
    const crossChain = route(step(1, 8453, failedExecution()))
    const sameChain = route(step(1, 1, failedExecution()))
    const swapOnly = { mode: 'split' as const, swapOnly: true }
    expect(canStartNewSwap({ ...swapOnly, route: crossChain })).toBe(false)
    expect(canStartNewSwap({ ...swapOnly, route: sameChain })).toBe(true)
  })
})

describe('getNewSwapFormValues', () => {
  it('should fill the form with the same swap and no receiver for the sender', () => {
    expect(
      getNewSwapFormValues(route(step(1, 8453, failedExecution())))
    ).toEqual({
      fromChain: 1,
      fromToken: '0xfrom1',
      fromAmount: '1.5',
      toChain: 8453,
      toToken: '0xto8453',
      toAddress: '',
    })
  })

  it('should treat a receiver in other letter case as the sender', () => {
    const otherCase = step(1, 8453, failedExecution(), SENDER.toUpperCase())
    expect(getNewSwapFormValues(route(otherCase)).toAddress).toBe('')
  })

  it('should keep a receiver that differs from the sender', () => {
    const toOther = step(1, 8453, failedExecution(), RECEIVER)
    expect(getNewSwapFormValues(route(toOther)).toAddress).toBe(RECEIVER)
  })

  it('should keep a required receiver that is the sender', () => {
    const values = getNewSwapFormValues(
      route(step(1, 8453, failedExecution())),
      {
        receiverRequired: true,
      }
    )
    expect(values.toAddress).toBe(SENDER)
  })

  it('should leave the receiver out when the integrator keeps it', () => {
    const toOther = step(1, 8453, failedExecution(), RECEIVER)
    const values = getNewSwapFormValues(route(toOther), { keepReceiver: true })
    expect(values).not.toHaveProperty('toAddress')
    expect(values).toMatchObject({ fromAmount: '1.5', toChain: 8453 })
  })

  it('should take the destination of a multi-step route, not of its first step', () => {
    const multiStep = route(
      step(1, 1, failedExecution()),
      step(1, 8453, undefined, RECEIVER)
    )
    expect(getNewSwapFormValues(multiStep)).toMatchObject({
      fromChain: 1,
      fromToken: '0xfrom1',
      toChain: 8453,
      toToken: '0xto8453',
      toAddress: RECEIVER,
    })
  })
})
