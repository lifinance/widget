import type { Chain, ChainType } from '@lifi/sdk'
import { getNameServiceAddress } from '@lifi/sdk'
import { useChainTypeFromAddress } from '@lifi/wallet-provider'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export enum AddressType {
  Address = 0,
  NameService = 1,
}

type ValidationArgs = {
  value: string
  chainType?: ChainType
  chain?: Chain
}

type ValidResponse = {
  address: string
  addressType: AddressType
  chainType: ChainType
  isValid: true
}

type InvalidResponse = {
  error: string
  isValid: false
}

export const useAddressValidation = () => {
  const { t } = useTranslation()
  const { getChainTypeFromAddress } = useChainTypeFromAddress()

  const { mutateAsync: validateAddress, isPending: isValidating } = useMutation(
    {
      mutationFn: async ({
        value,
        chainType,
        chain,
      }: ValidationArgs): Promise<ValidResponse | InvalidResponse> => {
        try {
          if (!value) {
            throw new Error()
          }

          const _chainType = getChainTypeFromAddress(value)
          if (_chainType) {
            return {
              address: value,
              addressType: AddressType.Address,
              chainType: _chainType,
              isValid: true,
            }
          }

          const address = await getNameServiceAddress(value, chainType)

          if (address) {
            const _chainType = getChainTypeFromAddress(address)
            if (_chainType) {
              return {
                address: address,
                addressType: AddressType.NameService,
                chainType: _chainType,
                isValid: true,
              }
            }
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
