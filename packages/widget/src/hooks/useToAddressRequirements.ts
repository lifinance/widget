import { useAccount } from '@lifi/wallet-management'
import { useChain } from '../hooks/useChain.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { RequiredUI } from '../types/widget.js'
import { isDelegationDesignatorCode } from '../utils/eip7702.js'
import { useIsContractAddress } from './useIsContractAddress.js'

export const useToAddressRequirements = () => {
  const { requiredUI } = useWidgetConfig()
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
  } = useIsContractAddress(account.address, fromChainId, account.chainType)
  const { isContractAddress: isToContractAddress } = useIsContractAddress(
    toAddress,
    toChainId,
    toChain?.chainType
  )

  const isDifferentChainType =
    fromChain && toChain && fromChain.chainType !== toChain.chainType

  const isCrossChainContractAddress =
    isFromContractAddress && fromChainId !== toChainId

  const accountNotDeployedAtDestination =
    isFromContractAddress &&
    // We don't want to block transfers for EIP-7702 accounts since they are designed
    // to maintain EOA-like properties while delegating execution.
    !isDelegationDesignatorCode(fromContractCode) &&
    !isToContractAddress &&
    account.address?.toLowerCase() === toAddress?.toLowerCase()

  const requiredToAddress =
    requiredUI?.includes(RequiredUI.ToAddress) ||
    isDifferentChainType ||
    isCrossChainContractAddress

  return {
    requiredToAddress,
    requiredToChainType: toChain?.chainType,
    accountNotDeployedAtDestination,
  }
}
