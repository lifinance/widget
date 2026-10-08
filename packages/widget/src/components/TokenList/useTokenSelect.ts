import { useCallback } from 'react'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useToAddressAutoPopulate } from '../../hooks/useToAddressAutoPopulate.js'
import { useToAddressReset } from '../../hooks/useToAddressReset.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import type { FormType } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useSplitMode } from '../../stores/navigationTabs/useNavigationTabsStore.js'
import { WidgetEvent } from '../../types/events.js'
import type { DisabledUIConfig } from '../../types/widget.js'
import { isItemAllowed } from '../../utils/item.js'

export const useTokenSelect = (
  formType: FormType,
  onClick?: () => void
): ((tokenAddress: string, chainId?: number) => void) => {
  const { mode, disabledUI, chains: chainsConfig } = useWidgetConfig()
  const splitMode = useSplitMode()
  const emitter = useWidgetEvents()
  const { setFieldValue, getFieldValues } = useFieldActions()
  const autoPopulateToAddress = useToAddressAutoPopulate()
  const { tryResetToAddress } = useToAddressReset()
  const { getChainById } = useAvailableChains()
  const [setChain, setIsAllNetworks] = useChainOrderStore((state) => [
    state.setChain,
    state.setIsAllNetworks,
  ])

  const tokenKey = FormKeyHelper.getTokenKey(formType)

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      const [toChainIdBefore] = getFieldValues('toChain')
      setFieldValue(tokenKey, tokenAddress, { isDirty: true, isTouched: true })
      const selectedChainId =
        chainId ?? getFieldValues(FormKeyHelper.getChainKey(formType))[0]
      // Set chain again to trigger URL builder update
      setFieldValue(FormKeyHelper.getChainKey(formType), selectedChainId, {
        isDirty: true,
        isTouched: true,
      })
      const amountKey = FormKeyHelper.getAmountKey(formType)
      if (!disabledUI?.[amountKey as keyof DisabledUIConfig]) {
        setFieldValue(amountKey, '')
      }
      const oppositeFormType = formType === 'from' ? 'to' : 'from'
      const [
        selectedOppositeTokenAddress,
        selectedOppositeChainId,
        selectedToAddress,
      ] = getFieldValues(
        FormKeyHelper.getTokenKey(oppositeFormType),
        FormKeyHelper.getChainKey(oppositeFormType),
        'toAddress'
      )

      // TODO: remove when we enable same chain/token transfers
      const isSameTokenTransfer =
        selectedOppositeTokenAddress === tokenAddress &&
        selectedOppositeChainId === selectedChainId

      const isBridgeToSameChain =
        mode === 'split' &&
        splitMode === 'bridge' &&
        selectedOppositeChainId === selectedChainId

      if ((isSameTokenTransfer || isBridgeToSameChain) && mode !== 'custom') {
        setFieldValue(FormKeyHelper.getTokenKey(oppositeFormType), '', {
          isDirty: true,
          isTouched: true,
        })
      }

      // If no opposite token is selected, synchronize the opposite chain
      // to match the currently selected chain (if allowed).
      // In default exchange mode, also collapse "All Networks" on the opposite
      // side - same-chain swap is the most common action.
      if (
        !selectedOppositeTokenAddress &&
        selectedChainId &&
        isItemAllowed(selectedChainId, chainsConfig?.[oppositeFormType])
      ) {
        const isDefaultExchange = !mode || mode === 'default'
        if (isDefaultExchange) {
          setIsAllNetworks(false, oppositeFormType)
        }
        setFieldValue(
          FormKeyHelper.getChainKey(oppositeFormType),
          selectedChainId,
          {
            isDirty: true,
            isTouched: true,
          }
        )
        setChain(selectedChainId, oppositeFormType)
      }

      // A token from "All networks" moves the destination without the chain select,
      // which resets a receiver the new chain cannot take.
      const [toChainId] = getFieldValues('toChain')
      const toChain = getChainById(toChainId)
      if (toChainId !== toChainIdBefore && toChain) {
        tryResetToAddress(toChain)
      }

      // Automatically populate toAddress field if bridging across ecosystems and compatible wallet is connected
      autoPopulateToAddress({
        formType,
        selectedToAddress,
        selectedChainId,
        selectedOppositeChainId,
        selectedOppositeTokenAddress,
      })

      const eventToEmit =
        formType === 'from'
          ? WidgetEvent.SourceChainTokenSelected
          : WidgetEvent.DestinationChainTokenSelected

      if (selectedChainId) {
        emitter.emit(eventToEmit, {
          chainId: selectedChainId,
          tokenAddress,
        })
      }

      onClick?.()
    },
    [
      autoPopulateToAddress,
      tryResetToAddress,
      getChainById,
      disabledUI,
      emitter,
      formType,
      getFieldValues,
      onClick,
      setChain,
      setIsAllNetworks,
      setFieldValue,
      mode,
      splitMode,
      tokenKey,
      chainsConfig,
    ]
  )
}
