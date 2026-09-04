import { describe, expect, it, vi } from 'vitest'
import {
  getRetryGates,
  getStartGates,
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
