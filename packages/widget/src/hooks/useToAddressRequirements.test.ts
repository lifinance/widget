import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useToAddressRequirements } from './useToAddressRequirements.js'

const mocks = vi.hoisted(() => {
  const chains: Record<
    number,
    { id: number; chainType: string; name: string }
  > = {
    1: { id: 1, chainType: 'EVM', name: 'Ethereum' },
    42161: { id: 42161, chainType: 'EVM', name: 'Arbitrum' },
    1151111081099710: {
      id: 1151111081099710,
      chainType: 'SVM',
      name: 'Solana',
    },
    20000000000001: { id: 20000000000001, chainType: 'UTXO', name: 'Bitcoin' },
    20000000000005: { id: 20000000000005, chainType: 'UTXO', name: 'Zcash' },
    1201081091099710: {
      id: 1201081091099710,
      chainType: 'STL',
      name: 'Stellar',
    },
  }
  const addresses = {
    evm: '0xB095274743941e953c746F9C228DA9c18Bb6ec29',
    btc: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    zec: 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC',
    stl: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
  }
  return {
    chains,
    addresses,
    isAddressForChain: (
      address: string,
      chain: { id: number; chainType: string }
    ) => {
      if (chain.chainType === 'EVM') {
        return address === addresses.evm
      }
      if (chain.chainType === 'STL') {
        return address === addresses.stl
      }
      if (chain.id === 20000000000001) {
        return address === addresses.btc
      }
      if (chain.id === 20000000000005) {
        return address === addresses.zec
      }
      return false
    },
    state: {
      fromChain: undefined as number | undefined,
      toChain: undefined as number | undefined,
      account: undefined as { address: string; chainType: string } | undefined,
      providerTypes: [] as string[],
    },
  }
})

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({}),
}))
vi.mock('../stores/form/useFieldValues.js', () => ({
  useFieldValues: () => [mocks.state.fromChain, mocks.state.toChain, ''],
}))
vi.mock('./useChain.js', () => ({
  useChain: (chainId?: number) => ({
    chain: chainId ? mocks.chains[chainId] : undefined,
  }),
}))
vi.mock('./useIsContractAddress.js', () => ({
  useIsContractAddress: () => ({
    isContractAddress: false,
    contractCode: undefined,
    isLoading: false,
    isFetched: true,
  }),
}))
vi.mock('@lifi/wallet-management', () => ({
  useAccount: ({ chainType }: { chainType?: string }) => ({
    account:
      mocks.state.account?.chainType === chainType
        ? mocks.state.account
        : { chainType },
  }),
}))
vi.mock('@lifi/widget-provider', () => ({
  useEthereumContext: () => ({ isDelegationDesignatorCode: () => false }),
  useAddressForChain: () => ({
    isAddressForChain: mocks.isAddressForChain,
    hasProviderFor: (chainType: string) =>
      mocks.state.providerTypes.includes(chainType),
  }),
}))

const BTC = 20000000000001
const ZEC = 20000000000005
const XLM = 1201081091099710
const SOL = 1151111081099710
const { addresses } = mocks

const requirements = (
  fromChain: number | undefined,
  toChain: number | undefined,
  account?: { address: string; chainType: string }
) => {
  mocks.state.fromChain = fromChain
  mocks.state.toChain = toChain
  mocks.state.account = account
  return useToAddressRequirements()
}

describe('useToAddressRequirements', () => {
  beforeEach(() => {
    mocks.state.providerTypes = ['EVM', 'SVM', 'UTXO', 'STL']
  })

  it('requires a receiver from BTC to ZEC, which share a chain type', () => {
    const btcAccount = { address: addresses.btc, chainType: 'UTXO' }
    expect(requirements(BTC, ZEC, btcAccount).requiredToAddress).toBe(true)
  })

  it('keeps today’s rules when no provider can check the destination', () => {
    mocks.state.providerTypes = ['EVM']
    const btcAccount = { address: addresses.btc, chainType: 'UTXO' }
    expect(requirements(BTC, ZEC, btcAccount).requiredToAddress).toBe(false)
  })

  it('requires no receiver between EVM chains', () => {
    const evmAccount = { address: addresses.evm, chainType: 'EVM' }
    expect(requirements(1, 42161, evmAccount).requiredToAddress).toBe(false)
  })

  it('still requires a receiver across ecosystems', () => {
    const evmAccount = { address: addresses.evm, chainType: 'EVM' }
    expect(requirements(1, SOL, evmAccount).requiredToAddress).toBe(true)
  })

  it('still requires none from Stellar to Stellar, where receivers are unsupported', () => {
    const stlAccount = { address: addresses.stl, chainType: 'STL' }
    expect(requirements(XLM, XLM, stlAccount).requiredToAddress).toBe(false)
  })

  describe('isValidReceiver', () => {
    it('checks an entry against the destination chain', () => {
      const { isValidReceiver } = requirements(1, ZEC)
      expect(isValidReceiver(addresses.zec)).toBe(true)
      expect(isValidReceiver(addresses.btc)).toBe(false)
      expect(isValidReceiver(undefined)).toBe(false)
    })

    it('accepts every entry while no destination is set', () => {
      const { isValidReceiver } = requirements(1, undefined)
      expect(isValidReceiver(addresses.btc)).toBe(true)
    })
  })
})
