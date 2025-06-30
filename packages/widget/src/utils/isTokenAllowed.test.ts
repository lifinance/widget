import type { Token } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import { isTokenAllowed } from './isTokenAllowed'

const baseToken = {
  address: '',
  chainId: 1,
}

const configTokens = {
  allow: [
    {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
    },
  ],
  deny: [
    {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 137,
    },
  ],
  from: {
    allow: [
      {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        chainId: 1,
      },
    ],
    deny: [
      {
        address: '0x0000000000000000000000000000000000000000',
        chainId: 1,
      },
    ],
  },
  to: {
    allow: [
      {
        address: '0x0000000000000000000000000000000000000000',
        chainId: 137,
      },
    ],
    deny: [
      {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        chainId: 1,
      },
    ],
  },
}

describe('isTokenAllowed', () => {
  it('allows a token globally allowed on matching chainId', () => {
    const token = {
      ...baseToken,
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
    } as Token

    expect(isTokenAllowed(token, configTokens, undefined)).toBe(true)
  })

  it('denies a token if globally denied on different chainId', () => {
    const token = {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 137,
    } as Token

    expect(isTokenAllowed(token, configTokens, undefined)).toBe(false)
  })

  it('denies a token if denied in `from` despite being globally allowed', () => {
    const token = {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
    } as Token

    expect(isTokenAllowed(token, configTokens, 'from')).toBe(false)
  })

  it('allows a token if allowed in `from` and not denied', () => {
    const token = {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      chainId: 1,
    } as Token

    expect(isTokenAllowed(token, configTokens, 'from')).toBe(true)
  })

  it('allows a token if allowed in `to` despite being globally denied on other chain', () => {
    const token = {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 137,
    } as Token

    expect(isTokenAllowed(token, configTokens, 'to')).toBe(true)
  })

  it('denies a token if denied in `to` despite being allowed in `from` or globally', () => {
    const token = {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      chainId: 1,
    } as Token

    expect(isTokenAllowed(token, configTokens, 'to')).toBe(false)
  })

  it('allows a token if no deny/allow lists exist', () => {
    const token = {
      address: '0x1111111111111111111111111111111111111111',
      chainId: 1,
    } as Token

    expect(isTokenAllowed(token, undefined, undefined)).toBe(true)
  })
})
