import { describe, expect, it } from 'vitest'
import { resolveUnsupportedToAddressClear } from './resolveUnsupportedToAddressClear.js'

describe('resolveUnsupportedToAddressClear', () => {
  it('does nothing when the pair supports a custom receiver', () => {
    expect(
      resolveUnsupportedToAddressClear({
        unsupportedToAddress: false,
        toAddressFieldValue: '0xabc',
        isConfiguredAddress: false,
        hasConsumerClear: false,
      })
    ).toBe('none')
  })

  it('does nothing when the field is already empty', () => {
    expect(
      resolveUnsupportedToAddressClear({
        unsupportedToAddress: true,
        toAddressFieldValue: '',
        isConfiguredAddress: false,
        hasConsumerClear: false,
      })
    ).toBe('none')
  })

  it('never clears an integrator-configured address', () => {
    expect(
      resolveUnsupportedToAddressClear({
        unsupportedToAddress: true,
        toAddressFieldValue: 'GMERCHANT',
        isConfiguredAddress: true,
        hasConsumerClear: false,
      })
    ).toBe('none')
  })

  it('delegates to the consumer clear when one is supplied', () => {
    expect(
      resolveUnsupportedToAddressClear({
        unsupportedToAddress: true,
        toAddressFieldValue: 'GUSER',
        isConfiguredAddress: false,
        hasConsumerClear: true,
      })
    ).toBe('consumer')
  })

  it('clears the form field when no consumer clear exists', () => {
    expect(
      resolveUnsupportedToAddressClear({
        unsupportedToAddress: true,
        toAddressFieldValue: 'GUSER',
        isConfiguredAddress: false,
        hasConsumerClear: false,
      })
    ).toBe('form')
  })
})
