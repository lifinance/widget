import { describe, expect, it } from 'vitest'
import { isAwaitingUserAction, orderStatusView } from './orderStatusView.js'

const base = {
  orderId: 'o',
  partnerOrderId: 'p',
  type: 'SMART_DEPOSIT',
  destination: { toChainId: 1, toTokenAddress: '0x1', toAddress: '0x2' },
  createdAt: '',
  updatedAt: '',
} as any

const quote = {
  id: 'quote-step-1',
  type: 'lifi',
  tool: 'relay',
  action: {
    fromChainId: 1,
    fromAmount: '1000000',
    fromToken: {
      chainId: 1,
      address: '0x0',
      decimals: 6,
      priceUSD: '1',
      symbol: 'USDC',
    },
    fromAddress: '0xSender',
    toChainId: 137,
    toToken: {
      chainId: 137,
      address: '0x1',
      decimals: 6,
      priceUSD: '1',
      symbol: 'USDC',
    },
    toAddress: '0xReceiver',
  },
  estimate: {
    fromAmountUSD: '1.00',
    toAmount: '990000',
    toAmountMin: '980000',
    toAmountUSD: '0.99',
    approvalAddress: '0xApproval',
    executionDuration: 30,
  },
  transactionRequest: { to: '0xTo', data: '0xdata' },
  includedSteps: [],
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

  it('exposes both hashes so callers can pick the source one', () => {
    const view = orderStatusView({
      ...base,
      status: 'DONE',
      result: { fromTxHash: '0xsource', toTxHash: '0xdest', toAmount: '9' },
    })
    expect(view.fromTxHash).toBe('0xsource')
    expect(view.toTxHash).toBe('0xdest')
  })

  it('leaves fromTxHash undefined when the order has no result yet', () => {
    const view = orderStatusView({ ...base, status: 'PENDING' })
    expect(view.fromTxHash).toBeUndefined()
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

  it('derives displayRoute from a STANDARD order', () => {
    const view = orderStatusView({
      ...base,
      type: 'STANDARD',
      quote,
      status: 'DONE',
    })
    expect(view.displayRoute).toBeDefined()
    expect(view.displayRoute?.id).toBe(base.orderId)
  })

  it('derives displayRoute from a SMART_DEPOSIT order with quote', () => {
    const view = orderStatusView({
      ...base,
      type: 'SMART_DEPOSIT',
      quote,
      status: 'PENDING',
    })
    expect(view.displayRoute).toBeDefined()
    expect(view.displayRoute?.id).toBe(base.orderId)
  })

  it('returns undefined displayRoute for an ONRAMP order without quote', () => {
    const view = orderStatusView({
      ...base,
      type: 'ONRAMP',
      status: 'PENDING',
    })
    expect(view.displayRoute).toBeUndefined()
  })
})

describe('isAwaitingUserAction', () => {
  it('is true for an unsent crypto deposit', () => {
    expect(
      isAwaitingUserAction({
        ...base,
        status: 'PENDING',
        substatus: 'INTENT_AWAITING_FUNDS',
      })
    ).toBe(true)
  })

  it('is true for an unpaid cash order', () => {
    expect(
      isAwaitingUserAction({
        ...base,
        status: 'PENDING',
        substatus: 'ONRAMP_AWAITING_PAYMENT',
      })
    ).toBe(true)
  })

  it('is false for an order already in flight', () => {
    expect(
      isAwaitingUserAction({
        ...base,
        status: 'PENDING',
        substatus: 'WAIT_DESTINATION_TRANSACTION',
      })
    ).toBe(false)
  })

  it('is false for a fresh STANDARD order (PENDING, no substatus)', () => {
    expect(isAwaitingUserAction({ ...base, status: 'PENDING' })).toBe(false)
  })

  it('is false for terminal orders even on an awaiting substatus', () => {
    expect(
      isAwaitingUserAction({
        ...base,
        status: 'DONE',
        substatus: 'INTENT_AWAITING_FUNDS',
      })
    ).toBe(false)
    expect(
      isAwaitingUserAction({
        ...base,
        status: 'FAILED',
        substatus: 'ONRAMP_AWAITING_PAYMENT',
      })
    ).toBe(false)
  })

  it('is false without an order', () => {
    expect(isAwaitingUserAction(undefined)).toBe(false)
  })
})
