import { describe, expect, it } from 'vitest'
import { orderStatusView } from './orderStatusView.js'

const base = {
  orderId: 'o',
  partnerOrderId: 'p',
  type: 'SMART_DEPOSIT',
  destination: { toChainId: 1, toTokenAddress: '0x1', toAddress: '0x2' },
  createdAt: '',
  updatedAt: '',
} as any

describe('orderStatusView', () => {
  it('is watching without an order', () => {
    expect(orderStatusView(undefined).phase).toBe('watching')
  })
  it('is watching while awaiting funds', () => {
    expect(
      orderStatusView({
        ...base,
        status: 'PENDING',
        substatus: 'INTENT_AWAITING_FUNDS',
      }).phase
    ).toBe('watching')
  })
  it('is pending once the deposit is in flight', () => {
    expect(
      orderStatusView({
        ...base,
        status: 'PENDING',
        substatus: 'WAIT_DESTINATION_TRANSACTION',
      }).phase
    ).toBe('pending')
  })
  it('exposes the result on done', () => {
    const view = orderStatusView({
      ...base,
      status: 'DONE',
      result: { toTxHash: '0xd', toAmount: '9' },
    })
    expect(view.phase).toBe('done')
    expect(view.toTxHash).toBe('0xd')
    expect(view.toAmount).toBe('9')
  })
  it('never throws on an unknown substatus', () => {
    expect(
      orderStatusView({
        ...base,
        status: 'PENDING',
        substatus: 'SOME_FUTURE_VALUE',
      }).phase
    ).toBe('pending')
  })
})
