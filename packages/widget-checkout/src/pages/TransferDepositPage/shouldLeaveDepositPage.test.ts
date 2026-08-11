import { describe, expect, it } from 'vitest'
import { shouldLeaveDepositPage } from './shouldLeaveDepositPage.js'

describe('shouldLeaveDepositPage', () => {
  it('stays while awaiting funds with an undefined substatus', () => {
    expect(
      shouldLeaveDepositPage({ substatus: undefined, phase: 'pending' })
    ).toBe(false)
  })

  it('stays while substatus is INTENT_AWAITING_FUNDS', () => {
    expect(
      shouldLeaveDepositPage({
        substatus: 'INTENT_AWAITING_FUNDS',
        phase: 'pending',
      })
    ).toBe(false)
  })

  it('leaves once the substatus moves past awaiting funds', () => {
    expect(
      shouldLeaveDepositPage({
        substatus: 'INTENT_READY',
        phase: 'pending',
      })
    ).toBe(true)
  })

  it('leaves once the phase is done', () => {
    expect(
      shouldLeaveDepositPage({ substatus: undefined, phase: 'done' })
    ).toBe(true)
  })

  it('leaves once the phase is failed', () => {
    expect(
      shouldLeaveDepositPage({ substatus: undefined, phase: 'failed' })
    ).toBe(true)
  })
})
