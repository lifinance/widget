import { ChainId, ChainType } from '@lifi/sdk'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ChainRef } from '../utils/chainTypeFromAddress.js'
import { useAddressForChain } from './useAddressForChain.js'

const mocks = vi.hoisted(() => ({
  evm: '0x1111111111111111111111111111111111111111',
  btc: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  zec: 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC',
  hasZcashProvider: true,
}))

vi.mock('react', () => ({
  useMemo: <T>(factory: () => T) => factory(),
  useCallback: <T>(callback: T) => callback,
}))

vi.mock('../contexts/EthereumContext.js', () => ({
  useEthereumContext: () => ({
    sdkProvider: {
      type: 'EVM',
      isAddress: (value: string) => value === mocks.evm,
    },
  }),
}))
// Like BitcoinProvider, it refuses every UTXO chain but BTC.
vi.mock('../contexts/BitcoinContext.js', () => ({
  useBitcoinContext: () => ({
    sdkProvider: {
      type: 'UTXO',
      isAddress: (value: string, chainId?: number) =>
        (chainId === undefined || chainId === 20000000000001) &&
        value === mocks.btc,
    },
  }),
}))
vi.mock('../contexts/ZcashContext.js', () => ({
  useZcashContext: () =>
    mocks.hasZcashProvider
      ? {
          sdkProvider: {
            type: 'UTXO',
            chainIds: [20000000000005],
            isAddress: (value: string) => value === mocks.zec,
          },
        }
      : {},
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
  afterEach(() => {
    mocks.hasZcashProvider = true
  })

  it('asks the provider that serves the destination chain', () => {
    const { isAddressForChain } = useAddressForChain()

    expect(isAddressForChain(mocks.zec, zcash)).toBe(true)
    expect(isAddressForChain(mocks.btc, zcash)).toBe(false)
    expect(isAddressForChain(mocks.btc, bitcoin)).toBe(true)
    expect(isAddressForChain(mocks.zec, bitcoin)).toBe(false)
    expect(isAddressForChain(mocks.evm, ethereum)).toBe(true)
  })

  it('refuses a Zcash address on ZEC without a Zcash provider', () => {
    mocks.hasZcashProvider = false
    const { isAddressForChain } = useAddressForChain()

    expect(isAddressForChain(mocks.zec, zcash)).toBe(false)
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
