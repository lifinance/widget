import { useAccount } from '@lifi/wallet-management'
import { useEffect } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { formDefaultValues } from '../../stores/form/createFormStore.js'
import { useSendToWalletActions } from '../../stores/settings/useSendToWalletStore.js'
import type { DefaultValues } from './types.js'
import { useFieldActions } from './useFieldActions.js'

export const FormUpdater: React.FC<{
  reactiveFormValues: Partial<DefaultValues>
}> = ({ reactiveFormValues }) => {
  const { toAddress } = useWidgetConfig()
  const { account } = useAccount()
  const { setSendToWallet } = useSendToWalletActions()
  const { setSelectedBookmark } = useBookmarkActions()
  const { setUserAndDefaultValues } = useFieldActions()

  // React to changes in widget config options (reactiveFormValues), updating userValues accordingly.
  // Includes special logic for chain fields, where account.chainId is only a fallback and not a direct reactivity source.
  // biome-ignore lint/correctness/useExhaustiveDependencies: account.chainId is used as a fallback only and does not need to be a dependency for reactivity.
  useEffect(() => {
    if (reactiveFormValues.toAddress) {
      setSendToWallet(true)
    }
    if (toAddress) {
      setSelectedBookmark(toAddress)
    }

    setUserAndDefaultValues(
      accountForChainId(reactiveFormValues, account.chainId)
    )
  }, [
    toAddress,
    reactiveFormValues,
    setUserAndDefaultValues,
    setSendToWallet,
    setSelectedBookmark,
  ])

  return null
}

const accountForChainId = (
  defaultValues: Partial<DefaultValues>,
  chainId?: number
) => {
  const result: Partial<DefaultValues> = { ...defaultValues }
  for (const key in result) {
    const k = key as keyof DefaultValues
    if (result[k] === formDefaultValues[k]) {
      if ((k === 'fromChain' || k === 'toChain') && chainId) {
        result[k] = chainId
      }
    }
  }
  return result
}
