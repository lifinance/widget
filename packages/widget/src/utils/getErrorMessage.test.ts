import {
  type ExecutionAction,
  LiFiErrorCode,
  type LiFiStepExtended,
} from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import en from '../i18n/en.json' with { type: 'json' }
import { getErrorMessage } from './getErrorMessage.js'

/** Resolves the real strings, so a copy change that breaks a message fails here. */
const t = ((key: string, opts?: Record<string, string>) => {
  const template = key
    .split('.')
    .reduce<unknown>((node, part) => (node as never)?.[part], en)
  if (typeof template !== 'string') {
    throw new Error(`Missing translation key: ${key}`)
  }
  return template.replace(/{{(\w+)}}/g, (_, name) => opts?.[name] ?? '')
}) as TFunction

const step = {
  action: {
    fromAmount: '1000000',
    fromChainId: 1,
    fromToken: { symbol: 'USDC', decimals: 6 },
  },
} as LiFiStepExtended

const failedSwap = (code: LiFiErrorCode): ExecutionAction => ({
  type: 'SWAP',
  status: 'FAILED',
  error: { code, message: 'raw error' },
})

describe('getErrorMessage', () => {
  it('should explain a call bundle the wallet has no record of', () => {
    expect(
      getErrorMessage(
        t,
        () => undefined,
        step,
        failedSwap(LiFiErrorCode.CallBundleNotFound)
      )
    ).toEqual({
      title: en.error.title.callBundleNotFound,
      message: en.error.message.callBundleNotFound,
    })
  })

  it('should keep the message for a rejected signature', () => {
    expect(
      getErrorMessage(
        t,
        () => undefined,
        step,
        failedSwap(LiFiErrorCode.SignatureRejected)
      )
    ).toEqual({
      title: en.error.title.signatureRejected,
      message: t('error.message.signatureRejected', {
        amount: '1',
        tokenSymbol: 'USDC',
        chainName: '',
      }),
    })
  })
})
