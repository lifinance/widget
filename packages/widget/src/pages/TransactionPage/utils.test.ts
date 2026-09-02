import { describe, expect, it } from 'vitest'
import { nextGate } from './utils.js'

type Gate = 'address' | 'tokens' | 'value'

const gates = (
  address: boolean,
  tokens: boolean,
  value: boolean
): readonly (readonly [Gate, boolean])[] => [
  ['address', address],
  ['tokens', tokens],
  ['value', value],
]

describe('nextGate', () => {
  it('should return the first gate that is needed', () => {
    expect(nextGate(gates(true, true, true))).toBe('address')
  })

  it('should skip gates that are not needed', () => {
    expect(nextGate(gates(false, false, true))).toBe('value')
  })

  it('should return undefined when no gate is needed', () => {
    expect(nextGate(gates(false, false, false))).toBeUndefined()
  })

  it('should resume after the gate the user cleared', () => {
    expect(nextGate(gates(true, true, true), 'address')).toBe('tokens')
  })

  it('should skip cleared gates that are still needed', () => {
    expect(nextGate(gates(true, false, true), 'address')).toBe('value')
  })

  it('should return undefined after the last needed gate', () => {
    expect(nextGate(gates(true, true, true), 'value')).toBeUndefined()
  })

  it('should return undefined when nothing follows the cleared gate', () => {
    expect(nextGate(gates(true, false, false), 'address')).toBeUndefined()
  })
})
