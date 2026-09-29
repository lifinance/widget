/** @vitest-environment happy-dom */

import type { ExtendedChain } from '@lifi/sdk'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WidgetConfig } from '../types/widget.js'

const txHash = `0x${'ab'.repeat(32)}`

let explorerUrls: WidgetConfig['explorerUrls']
let blockExplorerUrls: string[] = []

const getChainById = (id: number) =>
  ({
    id,
    chainType: 'EVM',
    metamask: { blockExplorerUrls },
  }) as unknown as ExtendedChain

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({ explorerUrls }),
}))

vi.mock('./useAvailableChains.js', () => ({
  useAvailableChains: () => ({ getChainById }),
}))

const { useExplorer } = await import('./useExplorer.js')

let explorer: ReturnType<typeof useExplorer>

const ExplorerHandle = (): null => {
  explorer = useExplorer()
  return null
}

let root: Root

beforeEach(() => {
  explorerUrls = undefined
  blockExplorerUrls = ['https://etherscan.io/']
  root = createRoot(document.createElement('div'))
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
})

const render = () => {
  act(() => {
    root.render(<ExplorerHandle />)
  })
}

describe('useExplorer', () => {
  it('builds links from an https explorer base', () => {
    render()
    expect(explorer.getAddressLink('0xabc', 1)).toBe(
      'https://etherscan.io/address/0xabc'
    )
    expect(explorer.getTransactionLink({ txHash, chain: 1 })).toBe(
      `https://etherscan.io/tx/${txHash}`
    )
  })

  it('returns no link when chain metadata carries a javascript: explorer base', () => {
    blockExplorerUrls = ['javascript:alert(document.domain)//']
    render()
    expect(explorer.getAddressLink('0xabc', 1)).toBeUndefined()
    expect(explorer.getTransactionLink({ txHash, chain: 1 })).toBeUndefined()
  })

  it('returns no link when the integrator config carries a javascript: explorer base', () => {
    explorerUrls = {
      1: ['javascript:alert(document.domain)'],
      internal: ['javascript:alert(document.domain)'],
    }
    render()
    expect(explorer.getAddressLink('0xabc', 1)).toBeUndefined()
    expect(explorer.getTransactionLink({ txHash })).toBeUndefined()
  })

  it('falls back to an https txLink when the hash link is rejected', () => {
    blockExplorerUrls = ['javascript:alert(document.domain)//']
    render()
    expect(
      explorer.getTransactionLink({
        txHash,
        txLink: 'https://scan.li.fi/tx/0xabc',
        chain: 1,
      })
    ).toBe('https://scan.li.fi/tx/0xabc')
  })

  it('rejects a javascript: txLink fallback', () => {
    render()
    expect(
      explorer.getTransactionLink({
        txLink: 'javascript:alert(document.domain)',
      })
    ).toBeUndefined()
  })
})
