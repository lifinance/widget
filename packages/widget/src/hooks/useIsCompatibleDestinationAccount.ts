import type { RouteExtended } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { isDelegationDesignatorCode } from '../utils/eip7702.js'
import { useChain } from './useChain.js'
import { useIsContractAddress } from './useIsContractAddress.js'

export const useIsCompatibleDestinationAccount = (route?: RouteExtended) => {
  const [formFromChainId, formToChainId, formToAddress] = useFieldValues(
    'fromChain',
    'toChain',
    'toAddress'
  )

  const fromChainId = route?.fromChainId ?? formFromChainId
  const toChainId = route?.toChainId ?? formToChainId

  const { chain: fromChain } = useChain(fromChainId)
  const { chain: toChain } = useChain(toChainId)
  const { account } = useAccount({
    chainType: fromChain?.chainType,
  })

  const fromAddress = route?.fromAddress ?? account.address
  const toAddress = route
    ? route.fromAddress !== route.toAddress
      ? route.toAddress
      : formToAddress
    : formToAddress

  const {
    isContractAddress: isFromContractAddress,
    contractCode: fromContractCode,
    isLoading: isFromContractLoading,
    isFetched: isFromContractFetched,
  } = useIsContractAddress(fromAddress, fromChainId, fromChain?.chainType)
  const {
    isContractAddress: isToContractAddress,
    isLoading: isToContractLoading,
    isFetched: isToContractFetched,
  } = useIsContractAddress(toAddress, toChainId, toChain?.chainType)

  const accountNotDeployedAtDestination =
    isFromContractAddress &&
    // We don't want to block transfers for EIP-7702 accounts since they are designed
    // to maintain EOA-like properties while delegating execution.
    !isDelegationDesignatorCode(fromContractCode) &&
    !isToContractAddress &&
    fromAddress?.toLowerCase() === toAddress?.toLowerCase()

  return {
    isCompatibleDestinationAccount: !accountNotDeployedAtDestination,
    isFromContractAddress,
    isToContractAddress,
    isLoading: isFromContractLoading || isToContractLoading,
    isFetched: isFromContractFetched && isToContractFetched,
  }
}
