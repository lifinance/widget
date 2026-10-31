import { describe, expect, it } from 'vitest'
import { WalletTagType } from '../types/walletTagType.js'
import { getConnectorTagType } from './walletTags.js'

describe('mobile WalletConnect entry tags', () => {
  it.each(['walletConnect', 'oath-wallet'])(
    'labels %s as QR, not an installed extension',
    (id) => {
      expect(getConnectorTagType(id, false)).toBe(WalletTagType.QrCode)
    }
  )
  it('marks Oath connected only after a session exists', () => {
    expect(getConnectorTagType('oath-wallet', true)).toBe(
      WalletTagType.Connected
    )
  })
})
