import { ChainId, ChainType } from '@lifi/sdk'
import { describe, expect, it, vi } from 'vitest'
import { useChainTypeFromAddress } from './useChainTypeFromAddress.js'

/**
 * One provider per ecosystem, each recognizing only its own two fixtures, so a
 * provider of the wrong `ChainType` answers with the wrong one.
 */
const mocks = vi.hoisted(() => {
  const provider = (type: string, wallet: string, token: string) => ({
    sdkProvider: {
      type,
      isAddress: (value: string) => value === wallet,
      isTokenAddress: (value: string) => value === token,
    },
  })
  return {
    wallets: {
      evm: '0x1111111111111111111111111111111111111111',
      svm: 'SVMwallet11111111111111111111111111111111111',
      utxo: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      zec: 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC',
      mvm: '0xmvmwallet',
      tvm: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      stl: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    },
    tokens: {
      evm: '0x2222222222222222222222222222222222222222',
      svm: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      mvm: '0x2::sui::SUI',
      tvm: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
      stl: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
    },
    provider,
  }
})

vi.mock('react', () => ({
  useMemo: <T>(factory: () => T) => factory(),
  useCallback: <T>(callback: T) => callback,
}))

vi.mock('../contexts/EthereumContext.js', () => ({
  useEthereumContext: () =>
    mocks.provider('EVM', mocks.wallets.evm, mocks.tokens.evm),
}))
vi.mock('../contexts/SolanaContext.js', () => ({
  useSolanaContext: () =>
    mocks.provider('SVM', mocks.wallets.svm, mocks.tokens.svm),
}))
vi.mock('../contexts/SuiContext.js', () => ({
  useSuiContext: () =>
    mocks.provider('MVM', mocks.wallets.mvm, mocks.tokens.mvm),
}))
vi.mock('../contexts/TronContext.js', () => ({
  useTronContext: () =>
    mocks.provider('TVM', mocks.wallets.tvm, mocks.tokens.tvm),
}))
vi.mock('../contexts/StellarContext.js', () => ({
  useStellarContext: () =>
    mocks.provider('STL', mocks.wallets.stl, mocks.tokens.stl),
}))
// BitcoinProvider ships no `isTokenAddress`, so the fake must not have one.
vi.mock('../contexts/BitcoinContext.js', () => ({
  useBitcoinContext: () => ({
    sdkProvider: {
      type: 'UTXO',
      isAddress: (value: string) => value === mocks.wallets.utxo,
    },
  }),
}))
vi.mock('../contexts/ZcashContext.js', () => ({
  useZcashContext: () => ({
    sdkProvider: {
      type: 'UTXO',
      chainIds: [20000000000005],
      isAddress: (value: string) => value === mocks.wallets.zec,
    },
  }),
}))

describe('useChainTypeFromAddress', () => {
  it('maps each ecosystem to its own chain type by wallet address', () => {
    const { getChainTypeFromAddress } = useChainTypeFromAddress()

    expect(getChainTypeFromAddress(mocks.wallets.evm)).toBe(ChainType.EVM)
    expect(getChainTypeFromAddress(mocks.wallets.svm)).toBe(ChainType.SVM)
    expect(getChainTypeFromAddress(mocks.wallets.utxo)).toBe(ChainType.UTXO)
    expect(getChainTypeFromAddress(mocks.wallets.zec)).toBe(ChainType.UTXO)
    expect(getChainTypeFromAddress(mocks.wallets.mvm)).toBe(ChainType.MVM)
    expect(getChainTypeFromAddress(mocks.wallets.tvm)).toBe(ChainType.TVM)
    expect(getChainTypeFromAddress(mocks.wallets.stl)).toBe(ChainType.STL)
  })

  it('maps each ecosystem to its own chain type by token address', () => {
    const { getChainTypeFromTokenAddress } = useChainTypeFromAddress()

    expect(getChainTypeFromTokenAddress(mocks.tokens.evm)).toBe(ChainType.EVM)
    expect(getChainTypeFromTokenAddress(mocks.tokens.svm)).toBe(ChainType.SVM)
    expect(getChainTypeFromTokenAddress(mocks.tokens.mvm)).toBe(ChainType.MVM)
    expect(getChainTypeFromTokenAddress(mocks.tokens.tvm)).toBe(ChainType.TVM)
    expect(getChainTypeFromTokenAddress(mocks.tokens.stl)).toBe(ChainType.STL)
  })

  it('does not treat a wallet address as a token address', () => {
    const { getChainTypeFromTokenAddress } = useChainTypeFromAddress()

    expect(getChainTypeFromTokenAddress(mocks.wallets.stl)).toBeUndefined()
    expect(getChainTypeFromTokenAddress(mocks.wallets.evm)).toBeUndefined()
  })

  it('finds no token chain type for Bitcoin, which implements no check', () => {
    const { getChainTypeFromAddress, getChainTypeFromTokenAddress } =
      useChainTypeFromAddress()

    expect(getChainTypeFromAddress(mocks.wallets.utxo)).toBe(ChainType.UTXO)
    expect(getChainTypeFromTokenAddress(mocks.wallets.utxo)).toBeUndefined()
    expect(getChainTypeFromTokenAddress('bitcoin')).toBeUndefined()
  })

  it('reports the chain of a provider that serves one chain only', () => {
    const { getChainFromAddress } = useChainTypeFromAddress()

    expect(getChainFromAddress(mocks.wallets.zec)).toEqual({
      chainType: ChainType.UTXO,
      chainId: ChainId.ZEC,
    })
    expect(getChainFromAddress(mocks.wallets.utxo)).toEqual({
      chainType: ChainType.UTXO,
    })
    expect(getChainFromAddress('not-an-address')).toBeUndefined()
  })
})
