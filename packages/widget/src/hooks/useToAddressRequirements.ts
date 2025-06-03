import type { RouteExtended } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useChain } from '../hooks/useChain.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { HiddenUI, RequiredUI } from '../types/widget.js'
import { isDelegationDesignatorCode } from '../utils/eip7702.js'
import { useIsContractAddress } from './useIsContractAddress.js'

export const useToAddressRequirements = (route?: RouteExtended) => {
  const { requiredUI, hiddenUI } = useWidgetConfig()
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
  } = useIsContractAddress(account.address, fromChainId, account.chainType)
  const {
    isContractAddress: isToContractAddress,
    isLoading: isToContractLoading,
    isFetched: isToContractFetched,
  } = useIsContractAddress(toAddress, toChainId, toChain?.chainType)

  const isDifferentChainType =
    fromChain && toChain && fromChain.chainType !== toChain.chainType

  // We don't want to block transfers for EIP-7702 accounts since they are designed
  // to maintain EOA-like properties while delegating execution.
  const fromContractCodeHasDelegationIndicator =
    isDelegationDesignatorCode(fromContractCode)

  const isCrossChainContractAddress =
    isFromContractAddress &&
    fromChainId !== toChainId &&
    !fromContractCodeHasDelegationIndicator

  const requiredToAddress =
    (isDifferentChainType ||
      isCrossChainContractAddress ||
      requiredUI?.includes(RequiredUI.ToAddress)) &&
    !hiddenUI?.includes(HiddenUI.ToAddress)

  const accountNotDeployedAtDestination =
    isFromContractAddress &&
    !fromContractCodeHasDelegationIndicator &&
    !isToContractAddress &&
    fromAddress?.toLowerCase() === toAddress?.toLowerCase()

  const accountDeployedAtDestination =
    isFromContractAddress &&
    isToContractAddress &&
    !fromContractCodeHasDelegationIndicator &&
    fromAddress?.toLowerCase() === toAddress?.toLowerCase()

  return {
    requiredToAddress,
    requiredToChainType: toChain?.chainType,
    accountNotDeployedAtDestination,
    accountDeployedAtDestination,
    toAddress,
    isFromContractAddress,
    isToContractAddress,
    isLoading: isFromContractLoading || isToContractLoading,
    isFetched: isFromContractFetched && isToContractFetched,
  }
}
