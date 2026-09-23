import type { Chain, ChainType } from '@lifi/sdk'
import { ChainId, getNameServiceAddress } from '@lifi/sdk'
import {
  useAddressForChain,
  useChainTypeFromAddress,
} from '@lifi/widget-provider'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { bookmarkChainId } from '../utils/chainType.js'

export enum AddressType {
  Address = 0,
  NameService = 1,
}

type ValidationArgs = {
  value: string
  chainType?: ChainType
  /** Strict: the receiver must be valid on this chain. */
  chain?: Chain
  /** Lenient, for bookmarks: also accepts an address valid only on this chain. */
  fallbackChain?: Chain
}

type ValidResponse = {
  address: string
  addressType: AddressType
  chainType: ChainType
  chainId?: ChainId
  isValid: true
}

type InvalidResponse = {
  error: string
  isValid: false
}

export const useAddressValidation = (): {
  validateAddress: (
    args: ValidationArgs
  ) => Promise<ValidResponse | InvalidResponse>
  isValidating: boolean
} => {
  const { t } = useTranslation()
  const { getChainTypeFromAddress } = useChainTypeFromAddress()
  const { isAddressForChain } = useAddressForChain()
  const sdkClient = useSDKClient()

  const validFor = (
    address: string,
    addressType: AddressType,
    chain: Chain
  ): ValidResponse => ({
    address,
    addressType,
    chainType: chain.chainType,
    chainId: bookmarkChainId(address, chain, isAddressForChain),
    isValid: true,
  })

  const validateForChain = async (
    value: string,
    chain: Chain
  ): Promise<ValidResponse | InvalidResponse> => {
    if (isAddressForChain(value, chain)) {
      return validFor(value, AddressType.Address, chain)
    }
    // A recognised address is no name to resolve.
    if (getChainTypeFromAddress(value)) {
      return {
        isValid: false,
        error: t('error.title.walletChainTypeInvalid', {
          chainName: chain.name,
        }),
      }
    }
    const resolved = await getNameServiceAddress(
      sdkClient,
      value,
      chain.chainType
    )
    if (resolved && isAddressForChain(resolved, chain)) {
      return validFor(resolved, AddressType.NameService, chain)
    }
    return {
      isValid: false,
      error:
        chain.id === ChainId.ZEC
          ? t('error.title.walletAddressInvalid', { context: 'zcash' })
          : t('error.title.walletAddressInvalid', {
              context: 'chain',
              chainName: chain.name,
            }),
    }
  }

  const validateWithoutChain = async (
    value: string,
    chainType?: ChainType,
    fallbackChain?: Chain
  ): Promise<ValidResponse | undefined> => {
    const detectedChainType = getChainTypeFromAddress(value)
    if (detectedChainType) {
      return {
        address: value,
        addressType: AddressType.Address,
        chainType: detectedChainType,
        isValid: true,
      }
    }
    if (fallbackChain && isAddressForChain(value, fallbackChain)) {
      return validFor(value, AddressType.Address, fallbackChain)
    }
    const address = await getNameServiceAddress(sdkClient, value, chainType)
    const resolvedChainType = address
      ? getChainTypeFromAddress(address)
      : undefined
    if (address && resolvedChainType) {
      return {
        address,
        addressType: AddressType.NameService,
        chainType: resolvedChainType,
        isValid: true,
      }
    }
    return undefined
  }

  const { mutateAsync: validateAddress, isPending: isValidating } = useMutation(
    {
      mutationFn: async ({
        value,
        chainType,
        chain,
        fallbackChain,
      }: ValidationArgs): Promise<ValidResponse | InvalidResponse> => {
        try {
          if (!value) {
            throw new Error()
          }
          if (chain) {
            return await validateForChain(value, chain)
          }
          const result = await validateWithoutChain(
            value,
            chainType,
            fallbackChain
          )
          if (result) {
            return result
          }
          throw new Error()
        } catch (_) {
          return {
            isValid: false,
            error: t(
              'error.title.walletAddressInvalid',
              chain?.name
                ? { context: 'chain', chainName: chain.name }
                : undefined
            ),
          }
        }
      },
    }
  )

  return {
    validateAddress,
    isValidating,
  }
}
