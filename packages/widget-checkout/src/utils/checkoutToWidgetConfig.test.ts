import { describe, expect, it } from 'vitest'
import type { CheckoutConfig } from '../types/config.js'
import { checkoutConfigToWidgetConfig } from './checkoutToWidgetConfig.js'

const minimalCheckout: CheckoutConfig = {
  integrator: 'test-integrator',
  config: {},
}

describe('checkoutConfigToWidgetConfig', () => {
  it('forces compact variant + custom deposit mode', () => {
    const result = checkoutConfigToWidgetConfig(minimalCheckout)
    expect(result.variant).toBe('compact')
    expect(result.mode).toBe('custom')
    expect(result.modeOptions).toEqual({ custom: { type: 'deposit' } })
  })

  it('leaves toChain/toToken undefined when omitted (CheckoutConfigGuard treats it as a config error)', () => {
    const result = checkoutConfigToWidgetConfig(minimalCheckout)
    expect(result.toChain).toBeUndefined()
    expect(result.toToken).toBeUndefined()
  })

  it('respects integrator-supplied toChain/toToken', () => {
    const result = checkoutConfigToWidgetConfig({
      integrator: 'x',
      config: { toChain: 137, toToken: '0xdeadbeef' },
    })
    expect(result.toChain).toBe(137)
    expect(result.toToken).toBe('0xdeadbeef')
  })

  it('adds required hiddenUI flags without losing existing entries', () => {
    const result = checkoutConfigToWidgetConfig({
      integrator: 'x',
      config: { hiddenUI: { history: true } },
    })
    expect(result.hiddenUI).toEqual({
      history: true,
      toToken: true,
      reverseTokensButton: true,
    })
  })

  it('adds required disabledUI flags without dropping existing ones', () => {
    const result = checkoutConfigToWidgetConfig({
      integrator: 'x',
      config: { disabledUI: { fromAmount: true } },
    })
    expect(result.disabledUI).toEqual({
      fromAmount: true,
      toToken: true,
    })
  })

  it('preserves integrator value', () => {
    const result = checkoutConfigToWidgetConfig(minimalCheckout)
    expect(result.integrator).toBe('test-integrator')
  })
})
