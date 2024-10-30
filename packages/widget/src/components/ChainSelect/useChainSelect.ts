import type { EVMChain } from '@lifi/sdk'
import { useChains } from '../../hooks/useChains.js'
import { useSwapOnly } from '../../hooks/useSwapOnly.js'
import { useToAddressReset } from '../../hooks/useToAddressReset.js'
import { useExternalWalletProvider } from '../../providers/WalletProvider/useExternalWalletProvider.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useChainOrder } from '../../stores/chains/useChainOrder.js'
import type { FormType } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldController } from '../../stores/form/useFieldController.js'
import type { DisabledUI } from '../../types/widget.js'

export const useChainSelect = (formType: FormType) => {
  const { disabledUI } = useWidgetConfig()
  const chainKey = FormKeyHelper.getChainKey(formType)
  const { onChange } = useFieldController({ name: chainKey })
  const { setFieldValue, getFieldValues } = useFieldActions()
  const { useExternalWalletProvidersOnly, externalChainTypes } =
    useExternalWalletProvider()
  const { chains, isLoading, getChainById } = useChains(
    formType,
    // If the integrator uses external wallet management and has not opted in for partial wallet management,
    // restrict the displayed chains to those compatible with external wallet management.
    // This ensures users only see chains for which they can sign transactions.
    formType === 'from' && useExternalWalletProvidersOnly
      ? externalChainTypes
      : undefined
  )

  const [chainOrder, setChainOrder] = useChainOrder(formType)
  const swapOnly = useSwapOnly()
  const { tryResetToAddress } = useToAddressReset()

  const getChains = () => {
    if (!chains) {
      return []
    }
    const selectedChains = chainOrder
      .map((chainId) => chains.find((chain) => chain.id === chainId))
      .filter(Boolean) as EVMChain[]
    return selectedChains
  }

  const setCurrentChain = (chainId: number) => {
    onChange(chainId)
    if (swapOnly) {
      setFieldValue(FormKeyHelper.getChainKey('to'), chainId, {
        isTouched: true,
      })
    }
    const tokenKey = FormKeyHelper.getTokenKey(formType)
    if (!disabledUI?.includes(tokenKey as DisabledUI)) {
      setFieldValue(tokenKey, '')
    }
    const amountKey = FormKeyHelper.getAmountKey(formType)
    if (!disabledUI?.includes(amountKey as DisabledUI)) {
      setFieldValue(amountKey, '')
    }
    setFieldValue('tokenSearchFilter', '')

    const [toChainId] = getFieldValues('toChain')
    const toChain = getChainById(toChainId)
    if (toChain) {
      tryResetToAddress(toChain)
    }
    setChainOrder(chainId, formType)
  }

  return {
    chainOrder,
    chains,
    getChains,
    isLoading,
    setChainOrder,
    setCurrentChain,
  }
}
