import { describe, expect, it } from 'vitest'
import { normalizeFiatCurrencies } from './useOnRampFiatCurrencies.js'

describe('normalizeFiatCurrencies', () => {
  it('maps the SDK fiat-currencies shape to the widget shape', () => {
    const result = normalizeFiatCurrencies({
      cryptoCurrencyCode: 'USDC',
      network: 'ethereum',
      defaultCurrency: 'EUR',
      fiatCurrencies: [
        {
          symbol: 'EUR',
          name: 'Euro',
          isAllowed: true,
          isPopular: true,
          supportingCountries: [],
          paymentOptions: [
            { id: 'card', name: 'Card', isActive: true } as any,
            { id: 'sepa', name: 'SEPA', isActive: false } as any,
          ],
        },
        {
          symbol: 'XXX',
          name: 'X',
          isAllowed: false,
          isPopular: false,
          supportingCountries: [],
          paymentOptions: [],
        },
      ],
    } as any)
    expect(result.defaultCurrency).toBe('EUR')
    expect(result.currencies).toEqual([
      { currency: 'EUR', paymentOptions: [{ id: 'card', name: 'Card' }] },
    ])
  })
})
