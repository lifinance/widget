import type { Token } from '@lifi/sdk'
import { describe, expect, it, vi } from 'vitest'
import { useTokenBalance } from './useTokenBalance.js'

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn((_options: { enabled: boolean }) => ({
    data: undefined,
    isLoading: false,
    refetch: () => {},
  })),
}))

vi.mock('react', () => ({
  useMemo: <T>(factory: () => T) => factory(),
  useCallback: <T>(callback: T) => callback,
}))
vi.mock('@tanstack/react-query', () => ({
  useQuery: mocks.useQuery,
  useQueryClient: () => ({}),
}))
vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => ({ config: { apiUrl: 'https://li.quest/v1' } }),
}))
vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({ queryScopeKey: 'test' }),
}))

const isEnabled = (token: Token) => {
  mocks.useQuery.mockClear()
  useTokenBalance('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', token)
  return mocks.useQuery.mock.calls[0][0].enabled
}

describe('useTokenBalance', () => {
  it('reads a balance on a chain a provider can read', () => {
    expect(
      isEnabled({ chainId: 20000000000001, address: 'bitcoin' } as Token)
    ).toBe(true)
  })

  it('reads no balance on a destination-only chain', () => {
    expect(
      isEnabled({ chainId: 20000000000005, address: 'zcash' } as Token)
    ).toBe(false)
  })
})
