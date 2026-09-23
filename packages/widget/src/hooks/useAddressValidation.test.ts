import type { Chain } from '@lifi/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AddressType, useAddressValidation } from './useAddressValidation.js'

const mocks = vi.hoisted(() => {
  const addresses = {
    evm: '0xB095274743941e953c746F9C228DA9c18Bb6ec29',
    solana: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    bitcoin: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    zcash: 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC',
    zcashUnified: 'u1l8xunezsvhq8fgzfl7404m450nwnd76zshscn6nfys7vyz2ywyh4cc5',
  }
  return {
    addresses,
    getNameServiceAddress: vi.fn(),
    // Chainless detection: Zcash is not recognised without a chain.
    getChainTypeFromAddress: (value: string) =>
      ({
        [addresses.evm]: 'EVM',
        [addresses.solana]: 'SVM',
        [addresses.bitcoin]: 'UTXO',
      })[value],
    isAddressForChain: (
      address: string,
      chain: { id: number; chainType: string }
    ) => {
      if (chain.chainType === 'EVM') {
        return address === addresses.evm
      }
      if (chain.chainType === 'SVM') {
        return address === addresses.solana
      }
      if (chain.id === 20000000000001) {
        return address === addresses.bitcoin
      }
      if (chain.id === 20000000000005) {
        return address === addresses.zcash
      }
      return false
    },
  }
})

vi.mock('@tanstack/react-query', () => ({
  useMutation: ({ mutationFn }: { mutationFn: unknown }) => ({
    mutateAsync: mutationFn,
    isPending: false,
  }),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { context?: string; chainName?: string }) =>
      [key, options?.context, options?.chainName].filter(Boolean).join('|'),
  }),
}))
vi.mock('@lifi/widget-provider', () => ({
  useChainTypeFromAddress: () => ({
    getChainTypeFromAddress: mocks.getChainTypeFromAddress,
  }),
  useAddressForChain: () => ({ isAddressForChain: mocks.isAddressForChain }),
}))
vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@lifi/sdk')>()),
  getNameServiceAddress: mocks.getNameServiceAddress,
}))
vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => ({}),
}))

const chain = (id: number, chainType: string, name: string) =>
  ({ id, chainType, name }) as Chain
const ethereum = chain(1, 'EVM', 'Ethereum')
const bitcoin = chain(20000000000001, 'UTXO', 'Bitcoin')
const zcash = chain(20000000000005, 'UTXO', 'Zcash')
const { addresses } = mocks

describe('useAddressValidation', () => {
  beforeEach(() => {
    mocks.getNameServiceAddress.mockReset()
    mocks.getNameServiceAddress.mockResolvedValue(undefined)
  })

  describe('with a destination chain', () => {
    it('accepts a transparent Zcash address for ZEC and keeps its chain', async () => {
      const { validateAddress } = useAddressValidation()

      expect(
        await validateAddress({ value: addresses.zcash, chain: zcash })
      ).toEqual({
        address: addresses.zcash,
        addressType: AddressType.Address,
        chainType: 'UTXO',
        chainId: 20000000000005,
        isValid: true,
      })
    })

    it('refuses a Bitcoin address for ZEC as the wrong chain, without a name lookup', async () => {
      const { validateAddress } = useAddressValidation()

      expect(
        await validateAddress({ value: addresses.bitcoin, chain: zcash })
      ).toEqual({
        isValid: false,
        error: 'error.title.walletChainTypeInvalid|Zcash',
      })
      expect(mocks.getNameServiceAddress).not.toHaveBeenCalled()
    })

    it('names the accepted formats for an unrecognised ZEC receiver', async () => {
      const { validateAddress } = useAddressValidation()

      expect(
        await validateAddress({ value: addresses.zcashUnified, chain: zcash })
      ).toEqual({
        isValid: false,
        error: 'error.title.zcashAddressInvalid',
      })
    })

    it('keeps today’s message for an address of another ecosystem', async () => {
      const { validateAddress } = useAddressValidation()

      expect(
        await validateAddress({ value: addresses.solana, chain: ethereum })
      ).toEqual({
        isValid: false,
        error: 'error.title.walletChainTypeInvalid|Ethereum',
      })
    })

    it('resolves a name in the destination ecosystem', async () => {
      mocks.getNameServiceAddress.mockResolvedValue(addresses.evm)
      const { validateAddress } = useAddressValidation()

      expect(
        await validateAddress({ value: 'vitalik.eth', chain: ethereum })
      ).toEqual({
        address: addresses.evm,
        addressType: AddressType.NameService,
        chainType: 'EVM',
        chainId: undefined,
        isValid: true,
      })
      expect(mocks.getNameServiceAddress).toHaveBeenCalledWith(
        {},
        'vitalik.eth',
        'EVM'
      )
    })

    it('sets no chain for a Bitcoin address on BTC', async () => {
      const { validateAddress } = useAddressValidation()

      expect(
        await validateAddress({ value: addresses.bitcoin, chain: bitcoin })
      ).toMatchObject({ isValid: true, chainId: undefined })
    })
  })

  describe('with a fallback chain', () => {
    it('keeps accepting an address of any ecosystem', async () => {
      const { validateAddress } = useAddressValidation()

      expect(
        await validateAddress({
          value: addresses.solana,
          fallbackChain: ethereum,
        })
      ).toMatchObject({ isValid: true, chainType: 'SVM' })
    })

    it('accepts a Zcash address while ZEC is the destination', async () => {
      const { validateAddress } = useAddressValidation()

      expect(
        await validateAddress({ value: addresses.zcash, fallbackChain: zcash })
      ).toMatchObject({
        isValid: true,
        chainType: 'UTXO',
        chainId: 20000000000005,
      })
    })
  })

  describe('without a chain', () => {
    it('answers as today', async () => {
      const { validateAddress } = useAddressValidation()

      expect(await validateAddress({ value: addresses.evm })).toMatchObject({
        isValid: true,
        chainType: 'EVM',
      })
      expect(await validateAddress({ value: addresses.zcash })).toEqual({
        isValid: false,
        error: 'error.title.walletAddressInvalid',
      })
    })
  })
})
