import { useAccount } from '@lifi/wallet-management'
import { useChain } from '../hooks/useChain.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { RequiredUI } from '../types/widget.js'
import { useIsContractAddress } from './useIsContractAddress.js'

export const useToAddressRequirements = () => {
  const { requiredUI } = useWidgetConfig()
  const [fromChainId, toChainId] = useFieldValues('fromChain', 'toChain')
  const { chain: fromChain } = useChain(fromChainId)
  const { chain: toChain } = useChain(toChainId)
  const { account } = useAccount({
    chainType: fromChain?.chainType,
  })
  const isFromContractAddress = useIsContractAddress(
    account.address,
    fromChainId,
    account.chainType
  )

  const isDifferentChainType =
    fromChain && toChain && fromChain.chainType !== toChain.chainType

  const isCrossChainContractAddress =
    isFromContractAddress && fromChainId !== toChainId

  const requiredToAddress =
    requiredUI?.includes(RequiredUI.ToAddress) ||
    isDifferentChainType ||
    isCrossChainContractAddress

  return {
    requiredToAddress,
    requiredToChainType: toChain?.chainType,
  }
}
