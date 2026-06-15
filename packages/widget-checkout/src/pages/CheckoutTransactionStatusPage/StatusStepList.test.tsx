// @vitest-environment happy-dom

import type { FullStatusData, Route } from '@lifi/sdk'
import { screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../test/renderWithI18n.js'

vi.mock('@lifi/widget/shared', () => ({
  ActionRow: ({
    startAdornment,
    message,
    endAdornment,
  }: {
    startAdornment?: ReactNode
    message: string
    endAdornment?: ReactNode
  }) => (
    <div data-testid="action-row">
      {startAdornment}
      <span>{message}</span>
      {endAdornment}
    </div>
  ),
  IconCircle: () => <div data-testid="icon-success" />,
  SentToWalletRow: () => <div data-testid="sent-to-wallet" />,
  useAvailableChains: () => ({ getChainById: () => ({ name: 'Ethereum' }) }),
  useExplorer: () => ({
    getTransactionLink: ({ txHash }: { txHash: string }) =>
      `https://scan/tx/${txHash}`,
  }),
}))

import { StatusStepList } from './StatusStepList.js'

function makeRoute(withSegment = true): Route {
  return {
    toChainId: 1,
    steps: [
      {
        action: { fromToken: { symbol: 'USDC' } },
        includedSteps: withSegment
          ? [
              {
                tool: 'dex',
                action: {
                  fromChainId: 1,
                  toChainId: 1,
                  toToken: { symbol: 'stETH' },
                },
              },
            ]
          : [],
      },
    ],
  } as unknown as Route
}

// Deposit-address poll payloads — no sending.txHash, ever.
const pendingStatus = {
  status: 'PENDING',
  substatus: 'INTENT_EXECUTING',
  sending: { chainId: 1 },
  receiving: { chainId: 1 },
} as unknown as FullStatusData

const doneStatus = {
  status: 'DONE',
  substatus: 'COMPLETED',
  sending: { chainId: 1 },
  receiving: {
    chainId: 1,
    txHash: '0xreceiving',
    txLink: 'https://etherscan.io/tx/0xreceiving',
  },
} as unknown as FullStatusData

describe('StatusStepList', () => {
  it('watching: all rows hollow — no spinners, no checkmarks, no links', () => {
    renderWithI18n(
      <StatusStepList phase="watching" frozenRoute={makeRoute()} />
    )
    expect(screen.getAllByTestId('action-row')).toHaveLength(2)
    expect(screen.queryAllByRole('progressbar')).toHaveLength(0)
    expect(screen.queryAllByTestId('icon-success')).toHaveLength(0)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('pending with sparse status: received done, segment spinning, no links', () => {
    renderWithI18n(
      <StatusStepList
        phase="pending"
        status={pendingStatus}
        frozenRoute={makeRoute()}
      />
    )
    expect(screen.getAllByTestId('icon-success')).toHaveLength(1)
    expect(screen.getAllByRole('progressbar')).toHaveLength(1)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('pending without status: received still spinning', () => {
    renderWithI18n(<StatusStepList phase="pending" frozenRoute={makeRoute()} />)
    expect(screen.queryAllByTestId('icon-success')).toHaveLength(0)
    expect(screen.getAllByRole('progressbar')).toHaveLength(2)
  })

  it('done: all checked, last segment links to the receiving tx, sent-to-wallet shown', () => {
    renderWithI18n(
      <StatusStepList
        phase="done"
        status={doneStatus}
        frozenRoute={makeRoute()}
        recipientAddress="0xrecipient"
      />
    )
    expect(screen.getAllByTestId('icon-success')).toHaveLength(2)
    expect(screen.queryAllByRole('progressbar')).toHaveLength(0)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('href')).toBe(
      'https://etherscan.io/tx/0xreceiving'
    )
    expect(screen.queryByTestId('sent-to-wallet')).not.toBeNull()
  })

  it('done without segments: received row carries the receiving link', () => {
    renderWithI18n(
      <StatusStepList
        phase="done"
        status={doneStatus}
        frozenRoute={makeRoute(false)}
      />
    )
    expect(screen.getAllByTestId('action-row')).toHaveLength(1)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('href')).toBe(
      'https://etherscan.io/tx/0xreceiving'
    )
  })
})
