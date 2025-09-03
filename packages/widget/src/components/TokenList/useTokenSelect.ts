import { useCallback } from 'react'
import { useToAddressAutoPopulate } from '../../hooks/useToAddressAutoPopulate.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import type { FormType } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useSplitSubvariantStore } from '../../stores/settings/useSplitSubvariantStore.js'
import { WidgetEvent } from '../../types/events.js'
import type { DisabledUI } from '../../types/widget.js'

export const useTokenSelect = (formType: FormType, onClick?: () => void) => {
  const { subvariant, disabledUI } = useWidgetConfig()
  const splitSubvariant = useSplitSubvariantStore((store) => store.state)
  const emitter = useWidgetEvents()
  const { setFieldValue, getFieldValues } = useFieldActions()
  const autoPopulateToAddress = useToAddressAutoPopulate()
  const setChain = useChainOrderStore((state) => state.setChain)

  const tokenKey = FormKeyHelper.getTokenKey(formType)

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      setFieldValue(tokenKey, tokenAddress, { isDirty: true, isTouched: true })
      const selectedChainId =
        chainId ?? getFieldValues(FormKeyHelper.getChainKey(formType))[0]
      // Set chain again to trigger URL builder update
      setFieldValue(FormKeyHelper.getChainKey(formType), selectedChainId, {
        isDirty: true,
        isTouched: true,
      })
      const amountKey = FormKeyHelper.getAmountKey(formType)
      if (!disabledUI?.includes(amountKey as DisabledUI)) {
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
        subvariant === 'split' &&
        splitSubvariant === 'bridge' &&
        selectedOppositeChainId === selectedChainId

      if (
        (isSameTokenTransfer || isBridgeToSameChain) &&
        subvariant !== 'custom'
      ) {
        setFieldValue(FormKeyHelper.getTokenKey(oppositeFormType), '', {
          isDirty: true,
          isTouched: true,
        })
      }

      // If no opposite token is selected, synchronize the opposite chain to match the currently selected chain
      if (!selectedOppositeTokenAddress && selectedChainId) {
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
      disabledUI,
      emitter,
      formType,
      getFieldValues,
      onClick,
      setChain,
      setFieldValue,
      subvariant,
      splitSubvariant,
      tokenKey,
    ]
  )
}
