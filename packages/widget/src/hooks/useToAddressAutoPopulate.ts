import { useAccount } from '@lifi/wallet-management'
import { useCallback } from 'react'
import { useBookmarkActions } from '../stores/bookmarks/useBookmarkActions.js'
import type { FormType } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useSendToWalletActions } from '../stores/settings/useSendToWalletStore.js'
import { getChainTypeFromAddress } from '../utils/chainType.js'
import { useAvailableChains } from './useAvailableChains.js'

export type UpdateToAddressArgs = {
  formType: FormType
  selectedToAddress?: string
  selectedChainId?: number
  selectedOppositeTokenAddress?: string
  selectedOppositeChainId?: number
}

/**
 * Automatically populates toAddress field if bridging across ecosystems and compatible wallet is connected
 */
export const useToAddressAutoPopulate = () => {
  const { setFieldValue } = useFieldActions()
  const { setSendToWallet } = useSendToWalletActions()
  const { setSelectedBookmark } = useBookmarkActions()
  const { getChainById } = useAvailableChains()
  const { accounts } = useAccount()

  return useCallback(
    ({
      formType,
      selectedToAddress,
      selectedChainId,
      selectedOppositeTokenAddress,
      selectedOppositeChainId,
    }: UpdateToAddressArgs) => {
      if (
        !selectedOppositeTokenAddress ||
        !selectedOppositeChainId ||
        !selectedChainId ||
        !accounts?.length
      ) {
        return
      }
      const selectedChain = getChainById?.(selectedChainId)
      const selectedOppositeChain = getChainById?.(selectedOppositeChainId)
      // Proceed if both chains are defined and of different ecosystem types (indicating cross-ecosystem bridging)
      if (
        !selectedChain ||
        !selectedOppositeChain ||
        selectedChain.chainType === selectedOppositeChain.chainType
      ) {
        return
      }
      // Identify the destination chain type based on the bridge direction ('from' or 'to')
      const destinationChainType =
        formType === 'from'
          ? selectedOppositeChain.chainType
          : selectedChain.chainType
      // If toAddress is already selected, verify that it matches the destination chain type
      if (selectedToAddress) {
        const selectedToAddressChainType =
          getChainTypeFromAddress(selectedToAddress)
        if (destinationChainType === selectedToAddressChainType) {
          return
        }
      }
      // Find connected account compatible with the destination chain type
      const destinationAccount = accounts?.find(
        (account) => account.chainType === destinationChainType
      )
      // If a compatible destination account is found, set toAddress as if selecting it from the "Send to Wallet" connected wallets page
      if (destinationAccount?.address) {
        setFieldValue('toAddress', destinationAccount.address, {
          isDirty: false,
          isTouched: true,
        })
        setSelectedBookmark({
          name: destinationAccount.connector?.name,
          address: destinationAccount.address,
          chainType: destinationAccount.chainType,
          isConnectedAccount: true,
        })
        setSendToWallet(true)
        return destinationAccount.address
      }
    },
    [
      accounts,
      getChainById,
      setFieldValue,
      setSelectedBookmark,
      setSendToWallet,
    ]
  )
}
