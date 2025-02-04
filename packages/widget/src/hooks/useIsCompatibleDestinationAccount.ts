import { useAccount } from '@lifi/wallet-management'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { isDelegationDesignatorCode } from '../utils/eip7702.js'
import { useChain } from './useChain.js'
import { useIsContractAddress } from './useIsContractAddress.js'

export const useIsCompatibleDestinationAccount = () => {
  const [fromChainId, toChainId, toAddress] = useFieldValues(
    'fromChain',
    'toChain',
    'toAddress'
  )
  const { chain: fromChain } = useChain(fromChainId)
  const { chain: toChain } = useChain(toChainId)
  const { account } = useAccount({
    chainType: fromChain?.chainType,
  })

  const {
    isContractAddress: isFromContractAddress,
    contractCode: fromContractCode,
    isLoading: isFromContractLoading,
    isFetched: isFromContractFetched,
  } = useIsContractAddress(account.address, fromChainId, account.chainType)
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
    account.address?.toLowerCase() === toAddress?.toLowerCase()

  return {
    isCompatibleDestinationAccount: !accountNotDeployedAtDestination,
    isFromContractAddress,
    isToContractAddress,
    isLoading: isFromContractLoading || isToContractLoading,
    isFetched: isFromContractFetched && isToContractFetched,
  }
}
