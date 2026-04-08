import type { LiFiStepExtended } from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { describe, expect, it, vi } from 'vitest'
import { getActionMessage } from './getActionMessage.js'

const allowanceStep = {
  action: {
    fromToken: { symbol: 'USDC' },
  },
} as LiFiStepExtended

describe('getActionMessage', () => {
  it('uses done copy when check allowance completes', () => {
    const t = vi.fn((key: string, opts?: { tokenSymbol: string }) =>
      opts ? `${key}:${opts.tokenSymbol}` : key
    ) as unknown as TFunction
    const { title } = getActionMessage(
      t,
      allowanceStep,
      'CHECK_ALLOWANCE',
      'DONE'
    )
    expect(t).toHaveBeenCalledWith('main.process.tokenAllowance.done', {
      tokenSymbol: 'USDC',
    })
    expect(title).toBe('main.process.tokenAllowance.done:USDC')
  })
})
