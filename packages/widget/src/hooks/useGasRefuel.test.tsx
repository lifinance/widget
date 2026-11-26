/** @vitest-environment happy-dom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WidgetMode } from '../types/widget.js'
import { useGasRefuel } from './useGasRefuel.js'

const config = vi.hoisted(() => ({ mode: 'default' as WidgetMode }))

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({ mode: config.mode }),
}))

vi.mock('../stores/form/useFieldValues.js', () => ({
  useFieldValues: () => [
    42161,
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    10,
    undefined,
  ],
}))

vi.mock('./useAvailableChains.js', () => ({
  useAvailableChains: () => ({
    getChainById: (id: number) => ({
      id,
      chainType: 'EVM',
      name: `Chain ${id}`,
      nativeToken: {
        address: '0x0000000000000000000000000000000000000000',
        chainId: id,
        decimals: 18,
        symbol: 'ETH',
      },
    }),
  }),
}))

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({
    account: { address: '0x00000000000000000000000000000000000000aa' },
  }),
}))

vi.mock('@lifi/widget-provider', () => ({
  useAddressForChain: () => ({ isAddressForChain: () => true }),
}))

// Each lookup mirrors its real query: no data while its key input is missing.
const lookups = vi.hoisted(() => ({
  useIsContractAddress: vi.fn((address?: string) => ({
    isContractAddress: address ? false : undefined,
  })),
  useTokenBalance: vi.fn((address?: string) => ({
    token: address ? { amount: 0n } : undefined,
  })),
  useGasRecommendation: vi.fn((toChainId?: number) => ({
    data: toChainId
      ? { available: true, recommended: { amount: '1000' }, fromAmount: '500' }
      : undefined,
    isLoading: false,
  })),
}))

vi.mock('./useIsContractAddress.js', () => ({
  useIsContractAddress: lookups.useIsContractAddress,
}))

vi.mock('./useTokenBalance.js', () => ({
  useTokenBalance: lookups.useTokenBalance,
}))

vi.mock('./useGasRecommendation.js', () => ({
  useGasRecommendation: lookups.useGasRecommendation,
}))

let container: HTMLDivElement
let root: Root
let result: ReturnType<typeof useGasRefuel> | undefined

const Probe = () => {
  result = useGasRefuel()
  return null
}

const renderHook = () => {
  act(() => {
    root.render(<Probe />)
  })
  return result!
}

beforeEach(() => {
  ;(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  config.mode = 'default'
  result = undefined
  vi.clearAllMocks()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('useGasRefuel', () => {
  it('enables the refuel in default mode when the destination gas is low', () => {
    const { enabled, fromAmount } = renderHook()
    expect(enabled).toBe(true)
    expect(fromAmount).toBe('500')
  })

  it('disables the refuel in refuel mode', () => {
    config.mode = 'refuel'
    expect(renderHook().enabled).toBe(false)
  })

  // Refuel mode never refuels, so it must not fetch the inputs, and the routes
  // query key must not change when a recommendation arrives.
  it('skips the gas lookups in refuel mode', () => {
    config.mode = 'refuel'
    expect(renderHook().fromAmount).toBeUndefined()
    expect(lookups.useGasRecommendation).toHaveBeenLastCalledWith(
      undefined,
      undefined,
      undefined
    )
    expect(lookups.useTokenBalance.mock.lastCall?.[0]).toBeUndefined()
    expect(lookups.useIsContractAddress.mock.lastCall?.[0]).toBeUndefined()
  })
})
