import { describe, expect, it } from 'vitest'
import {
  buildOnrampOrderRequest,
  buildSmartDepositOrderRequest,
  buildStandardOrderRequest,
} from './buildOrderRequest.js'

const destination = {
  toChainId: 8453,
  toTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  toAddress: '0xDest',
}

describe('buildOrderRequest', () => {
  it('builds a STANDARD request with the source leg', () => {
    const req = buildStandardOrderRequest({
      ...destination,
      fromChainId: 1,
      fromTokenAddress: '0xFrom',
      fromAmount: '1000000',
      fromAddress: '0xWallet',
    })
    expect(req.type).toBe('STANDARD')
    expect(req.partnerOrderId).toMatch(/[0-9a-f-]{36}/)
    expect(req.fromAddress).toBe('0xWallet')
    expect(req.refundAddress).toBeUndefined()
  })

  it('builds a SMART_DEPOSIT request with refundAddress = toAddress', () => {
    const req = buildSmartDepositOrderRequest({
      ...destination,
      fromChainId: 1,
      fromTokenAddress: '0xFrom',
      fromAmount: '1000000',
    })
    expect(req.type).toBe('SMART_DEPOSIT')
    expect(req.refundAddress).toBe('0xDest')
    expect(req.fromAddress).toBeUndefined()
  })

  it('builds an ONRAMP request without a source leg', () => {
    const req = buildOnrampOrderRequest({
      ...destination,
      fiatAmount: '100',
      fiatCurrency: 'EUR',
      paymentMethod: 'credit_debit_card',
    })
    expect(req.type).toBe('ONRAMP')
    expect(req.refundAddress).toBe('0xDest')
    expect(req.fromChainId).toBeUndefined()
    expect(req.fiatAmount).toBe('100')
  })

  it('generates a fresh partnerOrderId per call', () => {
    const a = buildOnrampOrderRequest({
      ...destination,
      fiatAmount: '1',
      fiatCurrency: 'EUR',
    })
    const b = buildOnrampOrderRequest({
      ...destination,
      fiatAmount: '1',
      fiatCurrency: 'EUR',
    })
    expect(a.partnerOrderId).not.toBe(b.partnerOrderId)
  })
})
