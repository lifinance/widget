import { useAccount } from '@lifi/wallet-management'
import { useEffect } from 'react'
import { useChains } from '../../hooks/useChains.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { formDefaultValues } from '../../stores/form/createFormStore.js'
import { useSendToWalletActions } from '../../stores/settings/useSendToWalletStore.js'
import type { DefaultValues } from './types.js'
import { useFieldActions } from './useFieldActions.js'

export const FormUpdater: React.FC<{
  reactiveFormValues: Partial<DefaultValues>
}> = ({ reactiveFormValues }) => {
  const { fromChain, toChain, toAddress } = useWidgetConfig()
  const { account } = useAccount()
  const { chains } = useChains()
  const { setSendToWallet } = useSendToWalletActions()
  const { setSelectedBookmark } = useBookmarkActions()
  const { isTouched, resetField, setFieldValue, setUserAndDefaultValues } =
    useFieldActions()

  // Set wallet chain as default if no chains are provided by config and if they were not changed during widget usage
  useEffect(() => {
    const chainAllowed =
      account.chainId && chains?.some((chain) => chain.id === account.chainId)

    if (!account.isConnected || !account.chainId || !chainAllowed) {
      return
    }

    if (!fromChain && !isTouched('fromChain') && !isTouched('fromToken')) {
      resetField('fromChain', { defaultValue: account.chainId })
      setFieldValue('fromToken', '')
      if (isTouched('fromAmount')) {
        setFieldValue('fromAmount', '')
      }
    }
    if (!toChain && !isTouched('toChain') && !isTouched('toToken')) {
      resetField('toChain', { defaultValue: account.chainId })
      setFieldValue('toToken', '')
    }
  }, [
    account.chainId,
    account.isConnected,
    chains,
    fromChain,
    toChain,
    isTouched,
    resetField,
    setFieldValue,
  ])

  // Makes widget config options reactive to changes
  // should update userValues when defaultValues updates and includes additional logic for chains
  useEffect(() => {
    if (reactiveFormValues.toAddress) {
      setSendToWallet(true)
    }

    setSelectedBookmark(toAddress)

    setUserAndDefaultValues(
      accountForChainId(reactiveFormValues, account.chainId)
    )
  }, [
    account.chainId,
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
