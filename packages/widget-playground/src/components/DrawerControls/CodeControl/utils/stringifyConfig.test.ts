import { describe, expect, test } from 'vitest'
import { stringifyConfig } from './stringifyConfig'

const expected = `const config = {
  walletConfig: {
    async onConnect() {
      }
  }
}`

describe('stringifyConfig', () => {
  test('should be able to add a string representation of a function', () => {
    const config = {
      walletConfig: { async onConnect() {} },
    }

    expect(stringifyConfig(config)).toEqual(expected)
  })
})
