import { ChainId, ChainType } from '@lifi/sdk'
import { describe, expect, it, vi } from 'vitest'
import type { ChainRef } from '../utils/chainTypeFromAddress.js'
import { useAddressForChain } from './useAddressForChain.js'

const mocks = vi.hoisted(() => ({
  evm: '0x1111111111111111111111111111111111111111',
  btc: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  zec: 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC',
  zecChainId: 20000000000005,
}))

vi.mock('react', () => ({
  useMemo: <T>(factory: () => T) => factory(),
  useCallback: <T>(callback: T) => callback,
}))

vi.mock('../contexts/EthereumContext.js', () => ({
  useEthereumContext: () => ({
    sdkProvider: { isAddress: (value: string) => value === mocks.evm },
  }),
}))
vi.mock('../contexts/BitcoinContext.js', () => ({
  useBitcoinContext: () => ({
    sdkProvider: {
      isAddress: (value: string, chainId?: number) =>
        chainId === mocks.zecChainId
          ? value === mocks.zec
          : value === mocks.btc,
    },
  }),
}))
// No provider configured for these ecosystems.
vi.mock('../contexts/SolanaContext.js', () => ({
  useSolanaContext: () => ({}),
}))
vi.mock('../contexts/SuiContext.js', () => ({ useSuiContext: () => ({}) }))
vi.mock('../contexts/TronContext.js', () => ({ useTronContext: () => ({}) }))
vi.mock('../contexts/StellarContext.js', () => ({
  useStellarContext: () => ({}),
}))

const zcash: ChainRef = { id: ChainId.ZEC, chainType: ChainType.UTXO }
const bitcoin: ChainRef = { id: ChainId.BTC, chainType: ChainType.UTXO }
const ethereum: ChainRef = { id: ChainId.ETH, chainType: ChainType.EVM }

describe('useAddressForChain', () => {
  it('checks an address against the destination chain', () => {
    const { isAddressForChain } = useAddressForChain()

    expect(isAddressForChain(mocks.zec, zcash)).toBe(true)
    expect(isAddressForChain(mocks.btc, zcash)).toBe(false)
    expect(isAddressForChain(mocks.btc, bitcoin)).toBe(true)
    expect(isAddressForChain(mocks.evm, ethereum)).toBe(true)
  })

  it('rejects every address of an ecosystem without a provider', () => {
    const { isAddressForChain } = useAddressForChain()

    expect(
      isAddressForChain(mocks.evm, {
        id: ChainId.XLM,
        chainType: ChainType.STL,
      })
    ).toBe(false)
  })
})
