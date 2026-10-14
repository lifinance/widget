import type { FullStatusData } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import {
  isRoutePartiallyDone,
  isRouteRefunded,
} from '../stores/routes/utils.js'
import { buildRouteFromTxHistory } from './converters.js'

const token = {
  address: '0x1111111111111111111111111111111111111111',
  chainId: 1,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  priceUSD: '1',
}

const makeHistory = (
  receivingChainId: number,
  overrides: Partial<FullStatusData> = {}
): FullStatusData =>
  ({
    transactionId: 'history-transaction',
    tool: 'bridge',
    status: 'DONE',
    sending: {
      chainId: 1,
      token,
      amount: '1000000',
      gasToken: token,
      txHash: '0xsource',
      txLink: 'https://etherscan.io/tx/0xsource',
    },
    receiving: {
      chainId: receivingChainId,
      token: { ...token, chainId: receivingChainId },
      amount: '900000',
      txHash: '0xreceived',
      txLink: 'https://example.com/tx/0xreceived',
    },
    ...overrides,
  }) as FullStatusData

describe('buildRouteFromTxHistory', () => {
  it('keeps a source-chain refund distinct from a completed same-chain swap', () => {
    const history = makeHistory(1, {
      substatus: 'REFUNDED',
      substatusMessage: 'The bridge refunded the transfer on the source chain.',
    })
    const { route } = buildRouteFromTxHistory(history)!

    expect(isRouteRefunded(route)).toBe(true)
    expect(route.steps[0].execution?.actions).toEqual([
      expect.objectContaining({
        type: 'CROSS_CHAIN',
        status: 'DONE',
        chainId: 1,
        txHash: '0xsource',
        txLink: history.sending.txLink,
      }),
      expect.objectContaining({
        type: 'RECEIVING_CHAIN',
        status: 'DONE',
        chainId: 1,
        txHash: '0xreceived',
        txLink: 'https://example.com/tx/0xreceived',
        substatus: 'REFUNDED',
        substatusMessage: history.substatusMessage,
      }),
    ])
    expect(route.steps[0].execution?.toAmount).toBe('900000')
    expect(route.steps[0].execution?.toToken).toEqual(token)
  })

  it('preserves a refund status when the receiving chain differs', () => {
    const { route } = buildRouteFromTxHistory(
      makeHistory(10, {
        substatus: 'REFUNDED',
        substatusMessage: 'Refund issued.',
      })
    )!

    expect(isRouteRefunded(route)).toBe(true)
    expect(route.steps[0].execution?.actions.at(-1)).toMatchObject({
      type: 'RECEIVING_CHAIN',
      chainId: 10,
      substatus: 'REFUNDED',
      substatusMessage: 'Refund issued.',
    })
  })

  it.each([1, 10])('preserves partial completion on chain %s', (chainId) => {
    const { route } = buildRouteFromTxHistory(
      makeHistory(chainId, {
        substatus: 'PARTIAL',
        substatusMessage: 'The destination swap could not be completed.',
      })
    )!

    expect(isRoutePartiallyDone(route)).toBe(true)
    expect(isRouteRefunded(route)).toBe(false)
    expect(route.steps[0].execution?.actions.at(-1)).toMatchObject({
      substatus: 'PARTIAL',
      substatusMessage: 'The destination swap could not be completed.',
    })
  })

  it('keeps a completed same-chain swap as a single action', () => {
    const { route } = buildRouteFromTxHistory(
      makeHistory(1, { substatus: 'COMPLETED' })
    )!

    expect(isRouteRefunded(route)).toBe(false)
    expect(route.steps[0].execution?.actions).toEqual([
      expect.objectContaining({
        type: 'SWAP',
        status: 'DONE',
        txHash: '0xsource',
        substatus: 'COMPLETED',
        substatusMessage: '',
      }),
    ])
  })

  it.each([1, 10])(
    'retains defaults for legacy history on chain %s',
    (chainId) => {
      const completed = buildRouteFromTxHistory(makeHistory(chainId))!
      const failed = buildRouteFromTxHistory(
        makeHistory(chainId, { status: 'FAILED' })
      )!

      expect(completed.route.steps[0].execution?.actions.at(-1)).toMatchObject({
        status: 'DONE',
        substatus: 'COMPLETED',
        substatusMessage: '',
      })
      expect(failed.route.steps[0].execution?.actions.at(-1)).toMatchObject({
        status: 'FAILED',
        substatus: 'UNKNOWN_ERROR',
        substatusMessage: '',
      })
    }
  )
})
