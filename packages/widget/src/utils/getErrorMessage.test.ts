import {
  BalanceError,
  CheckBalanceTask,
  type ExecutionAction,
  LiFiErrorCode,
  type LiFiStepExtended,
  SDKError,
  type Token,
} from '@lifi/sdk'
import { createInstance } from 'i18next'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import en from '../i18n/en.json'
import { getErrorMessage } from './getErrorMessage.js'

const i18n = createInstance()
const token: Token = {
  chainId: 1,
  address: '0x1111111111111111111111111111111111111111',
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  priceUSD: '1',
}
const step = {
  action: {
    fromAddress: '0x2222222222222222222222222222222222222222',
    fromChainId: 1,
    fromToken: token,
    fromAmount: '1000000',
  },
  estimate: {},
} as LiFiStepExtended

beforeAll(async () => {
  await i18n.init({ lng: 'en', resources: { en: { translation: en } } })
})
afterEach(() => vi.useRealTimers())

const renderError = (error: ExecutionAction['error']) =>
  getErrorMessage(i18n.t, () => undefined, step, {
    type: 'SWAP',
    status: 'FAILED',
    error,
  })

describe('balance error messages', () => {
  it.each(['RPC rejection', 'missing balance', 'timeout', 'shortfall'])(
    'classifies the SDK balance error for %s',
    async (scenario) => {
      vi.useFakeTimers()
      const getBalance = vi.fn(async () => {
        if (scenario === 'RPC rejection') {
          throw new Error('RPC unavailable')
        }
        if (scenario === 'timeout') {
          return new Promise<never>(() => {})
        }
        return [{ ...token, amount: scenario === 'shortfall' ? 0n : undefined }]
      })
      const pending = new CheckBalanceTask()
        .run({
          client: {
            getChainById: async () => ({ id: 1 }),
            providers: [{ isAddress: () => true, getBalance }],
          },
          step,
          statusManager: { initializeAction: vi.fn() },
          isBridgeExecution: false,
        } as never)
        .catch((error: unknown) => error)
      await vi.runAllTimersAsync()
      const error = await pending
      expect(error).toBeInstanceOf(BalanceError)
      const parsed = new SDKError(error as BalanceError)
      // BaseStepExecutor stores only these fields on a failed execution action.
      const result = renderError({
        code: parsed.code,
        message: parsed.cause.message,
      })

      if (scenario === 'shortfall') {
        expect(result.title).toBe('The balance is too low')
      } else {
        expect(result.title).toBe('Could not read wallet balance')
        expect(result.message).toBe(
          'Your wallet balance could not be checked. Please try again.'
        )
        expect(result.message).not.toContain('remain in your wallet')
      }
    }
  )

  it('retains the existing handling for other balance errors', () => {
    expect(
      renderError({
        code: LiFiErrorCode.BalanceError,
        message: 'Balance check failed',
      }).title
    ).toBe('The balance is too low')
  })

  it('does not classify unrelated error codes by their message', () => {
    expect(
      renderError({
        code: LiFiErrorCode.InsufficientFunds,
        message: 'Could not read wallet balance.',
      }).title
    ).toBe('Insufficient funds')
  })
})
