import type { RouteExtended } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useAddressForChain, useEthereumContext } from '@lifi/widget-provider'
import { useChain } from '../hooks/useChain.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import {
  isCustomReceiverBlocked,
  isCustomReceiverUnsupported,
} from '../utils/customReceiver.js'
import { useIsContractAddress } from './useIsContractAddress.js'

export const useToAddressRequirements = (
  route?: RouteExtended
): {
  requiredToAddress: boolean
  unsupportedToAddress: boolean
  unsupportedReceiverBlocking: boolean
  /** Whether a saved or connected address can receive on the destination chain. */
  isValidReceiver: (address?: string) => boolean
  accountNotDeployedAtDestination: boolean
  accountDeployedAtDestination: boolean
  toAddress: string | undefined
  isFromContractAddress: boolean | undefined
  isToContractAddress: boolean | undefined
  isLoading: boolean
  isFetched: boolean
} => {
  const { requiredUI, hiddenUI } = useWidgetConfig()
  const [formFromChainId, formToChainId, formToAddress] = useFieldValues(
    'fromChain',
    'toChain',
    'toAddress'
  )
  const { isDelegationDesignatorCode } = useEthereumContext()
  const { isAddressForChain } = useAddressForChain()

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
  } = useIsContractAddress(account.address, fromChain?.id, account.chainType)
  const {
    isContractAddress: isToContractAddress,
    isLoading: isToContractLoading,
    isFetched: isToContractFetched,
  } = useIsContractAddress(toAddress, toChain?.id, toChain?.chainType)

  const isDifferentChainType =
    fromChain && toChain && fromChain.chainType !== toChain.chainType

  // We don't want to block transfers for EIP-7702 accounts since they are designed
  // to maintain EOA-like properties while delegating execution.
  const fromContractCodeHasDelegationIndicator =
    isDelegationDesignatorCode?.(fromContractCode)

  const isCrossChainContractAddress =
    isFromContractAddress &&
    fromChainId !== toChainId &&
    !fromContractCodeHasDelegationIndicator

  const unsupportedToAddress = isCustomReceiverUnsupported(
    fromChain?.chainType,
    toChain?.chainType
  )

  const unsupportedReceiverBlocking = isCustomReceiverBlocked({
    fromChainType: fromChain?.chainType,
    toChainType: toChain?.chainType,
    toAddress,
    signerAddress: fromAddress,
    receiverRequired: requiredUI?.toAddress,
  })

  // A shared chain type is not a shared format: a Bitcoin signer cannot receive on ZEC.
  const isSignerAddressInvalidAtDestination = Boolean(
    fromAddress &&
      fromChain &&
      toChain &&
      isAddressForChain(fromAddress, fromChain) &&
      !isAddressForChain(fromAddress, toChain)
  )

  const requiredToAddress = Boolean(
    (isDifferentChainType ||
      isCrossChainContractAddress ||
      isSignerAddressInvalidAtDestination ||
      requiredUI?.toAddress) &&
      !hiddenUI?.toAddress &&
      !unsupportedToAddress
  )

  const isValidReceiver = (address?: string): boolean =>
    !toChain || (!!address && isAddressForChain(address, toChain))

  const accountNotDeployedAtDestination = Boolean(
    isFromContractAddress &&
      !fromContractCodeHasDelegationIndicator &&
      !isToContractAddress &&
      fromAddress?.toLowerCase() === toAddress?.toLowerCase()
  )

  const accountDeployedAtDestination = Boolean(
    isFromContractAddress &&
      isToContractAddress &&
      !fromContractCodeHasDelegationIndicator &&
      fromAddress?.toLowerCase() === toAddress?.toLowerCase()
  )

  return {
    requiredToAddress,
    unsupportedToAddress,
    unsupportedReceiverBlocking,
    isValidReceiver,
    accountNotDeployedAtDestination,
    accountDeployedAtDestination,
    toAddress,
    isFromContractAddress,
    isToContractAddress,
    isLoading: isFromContractLoading || isToContractLoading,
    isFetched: isFromContractFetched && isToContractFetched,
  }
}
