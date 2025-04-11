import { describe, expect, it } from 'vitest'
import { compactNumberFormatter } from './compactNumberFormatter.js'

describe('Compact Number Formatter', () => {
  describe('basic formatting', () => {
    const testCases = [
      { input: '0.123456789', expected: '0.123456' },
      { input: '0.0123456', expected: '0.012345' },
      { input: '0.00123456', expected: '0.001234' },
      { input: '0.000123456', expected: '0.000123' },
      { input: '0.06942', expected: '0.06942' },
      { input: '0.006942', expected: '0.006942' },
      { input: '0.0006942', expected: '0.000694' },
      { input: '0.00006942', expected: '0.0₄6942' },
      { input: '0.00000123456', expected: '0.0₅1234' },
      { input: '0.000006942', expected: '0.0₅6942' },
      { input: '0.00000000001', expected: '0.0₁₀1' },
      { input: '0.00000006942', expected: '0.0₇6942' },
      { input: '0.0000000694269', expected: '0.0₇6942' },
      { input: '0.0000000694069', expected: '0.0₇694' },
      { input: '0.000000006942', expected: '0.0₈6942' },
      {
        input: '0.000000000000006942',
        expected: '0.0₁₄6942',
      },
      { input: '-0.0000042', expected: '-0.0₅42' },
      { input: '-0.000000042', expected: '-0.0₇42' },
      { input: '1.0000000042', expected: '1.0₈42' },
      { input: '123456789.00042', expected: '123456789.00042' },
      {
        input: '123456789.000042',
        expected: '123456789.0₄42',
      },
      {
        input: '123456789.0000042',
        expected: '123456789.0₅42',
      },
      { input: '1234567.000000042', expected: '1234567.0₇42' },
      {
        input: '1234567.000000042',
        expected: '1,234,567.0₇42',
        lng: 'en',
        useGrouping: true,
      },
      {
        input: '1234567.987654321',
        expected: '1,234,567.987654',
        lng: 'en',
        useGrouping: true,
      },
      {
        input: '1234567.000000042',
        expected: '1.234.567,0₇42',
        lng: 'de',
        useGrouping: true,
      },
    ]

    testCases.forEach(({ input, expected, lng, useGrouping = false }) => {
      it(`should format ${input} correctly`, () => {
        expect(compactNumberFormatter(lng, { useGrouping })(input)).toBe(
          expected
        )
      })
    })
  })
})
