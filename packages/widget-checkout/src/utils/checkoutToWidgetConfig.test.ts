import { DisabledUI, HiddenUI } from '@lifi/widget/shared'
import { describe, expect, it } from 'vitest'
import type { CheckoutConfig } from '../types/config.js'
import { checkoutConfigToWidgetConfig } from './checkoutToWidgetConfig.js'

const minimalCheckout: CheckoutConfig = {
  integrator: 'test-integrator',
  config: {},
}

describe('checkoutConfigToWidgetConfig', () => {
  it('forces compact variant + custom deposit subvariant', () => {
    const result = checkoutConfigToWidgetConfig(minimalCheckout)
    expect(result.variant).toBe('compact')
    expect(result.subvariant).toBe('custom')
    expect(result.subvariantOptions).toEqual({ custom: 'deposit' })
  })

  it('defaults toChain=1 and toToken to Lido stETH when integrator omits them', () => {
    const result = checkoutConfigToWidgetConfig(minimalCheckout)
    expect(result.toChain).toBe(1)
    expect(result.toToken).toBe('0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84')
  })

  it('respects integrator-supplied toChain/toToken', () => {
    const result = checkoutConfigToWidgetConfig({
      integrator: 'x',
      config: { toChain: 137, toToken: '0xdeadbeef' },
    })
    expect(result.toChain).toBe(137)
    expect(result.toToken).toBe('0xdeadbeef')
  })

  it('appends required hiddenUI flags without losing existing entries', () => {
    const result = checkoutConfigToWidgetConfig({
      integrator: 'x',
      config: { hiddenUI: [HiddenUI.History] },
    })
    expect(result.hiddenUI).toEqual(
      expect.arrayContaining([
        HiddenUI.History,
        HiddenUI.ToToken,
        HiddenUI.ReverseTokensButton,
      ])
    )
  })

  it('deduplicates hiddenUI flags', () => {
    const result = checkoutConfigToWidgetConfig({
      integrator: 'x',
      config: { hiddenUI: [HiddenUI.ToToken] },
    })
    const toTokenCount = (result.hiddenUI ?? []).filter(
      (flag) => flag === HiddenUI.ToToken
    ).length
    expect(toTokenCount).toBe(1)
  })

  it('appends required disabledUI flags without dropping existing ones', () => {
    const result = checkoutConfigToWidgetConfig({
      integrator: 'x',
      config: { disabledUI: [DisabledUI.FromAmount] },
    })
    expect(result.disabledUI).toEqual(
      expect.arrayContaining([DisabledUI.FromAmount, DisabledUI.ToToken])
    )
  })

  it('preserves integrator value', () => {
    const result = checkoutConfigToWidgetConfig(minimalCheckout)
    expect(result.integrator).toBe('test-integrator')
  })
})
