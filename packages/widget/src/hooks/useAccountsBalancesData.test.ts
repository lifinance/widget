import type { TokenExtended } from '@lifi/sdk'
import { describe, expect, it, vi } from 'vitest'
import { useAccountsBalancesData } from './useAccountsBalancesData.js'

const mocks = vi.hoisted(() => {
  const btc = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  const account = { address: btc, chainType: 'UTXO', isConnected: true }
  const chains = [
    { id: 20000000000001, chainType: 'UTXO' },
    { id: 20000000000005, chainType: 'UTXO' },
  ]
  return {
    btc,
    account,
    chains,
    isAddressForChain: (address: string, chain: { id: number }) =>
      chain.id === 20000000000001 && address === btc,
  }
})

vi.mock('react', () => ({ useMemo: <T>(factory: () => T) => factory() }))
vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [mocks.account], account: mocks.account }),
}))
vi.mock('@lifi/widget-provider', () => ({
  useAddressForChain: () => ({ isAddressForChain: mocks.isAddressForChain }),
}))
vi.mock('./useChains.js', () => ({
  useChains: () => ({
    chains: mocks.chains,
    isLoading: false,
    getChainById: (chainId: number, chains?: { id: number }[]) =>
      chains?.find((chain) => chain.id === chainId),
  }),
}))

const token = (chainId: number) =>
  ({ chainId, address: 'native' }) as TokenExtended

describe('useAccountsBalancesData', () => {
  it('asks a Bitcoin wallet for BTC balances only, never ZEC', () => {
    const { data } = useAccountsBalancesData(undefined, 'to', true, {
      20000000000001: [token(20000000000001)],
      20000000000005: [token(20000000000005)],
    })

    expect(Object.keys(data?.[mocks.btc] ?? {})).toEqual(['20000000000001'])
  })
})
