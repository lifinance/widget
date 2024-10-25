import { useCallback } from 'react'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useChainOrderStoreContext } from '../../stores/chains/ChainOrderStore.js'
import type { FormType } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldController } from '../../stores/form/useFieldController.js'
import { WidgetEvent } from '../../types/events.js'
import type { DisabledUI } from '../../types/widget.js'

export const useTokenSelect = (formType: FormType, onClick?: () => void) => {
  const { subvariant, disabledUI } = useWidgetConfig()
  const emitter = useWidgetEvents()
  const { setFieldValue, getFieldValues } = useFieldActions()
  const tokenKey = FormKeyHelper.getTokenKey(formType)
  const { onChange } = useFieldController({ name: tokenKey })
  const chainOrderStore = useChainOrderStoreContext()

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      onChange(tokenAddress)
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
      const [selectedOppositeToken, selectedOppositeChainId] = getFieldValues(
        FormKeyHelper.getTokenKey(oppositeFormType),
        FormKeyHelper.getChainKey(oppositeFormType)
      )
      // TODO: remove when we enable same chain/token transfers
      if (
        selectedOppositeToken === tokenAddress &&
        selectedOppositeChainId === selectedChainId &&
        subvariant !== 'custom'
      ) {
        setFieldValue(FormKeyHelper.getTokenKey(oppositeFormType), '', {
          isDirty: true,
          isTouched: true,
        })
      }

      // If the destination token is not selected, update the destination chain to match the source one.
      const { setChain } = chainOrderStore.getState()
      if (formType === 'from' && !selectedOppositeToken && selectedChainId) {
        setFieldValue(FormKeyHelper.getChainKey('to'), selectedChainId, {
          isDirty: true,
          isTouched: true,
        })
        setChain(selectedChainId, 'to')
      }

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
      chainOrderStore,
      disabledUI,
      emitter,
      formType,
      getFieldValues,
      onChange,
      onClick,
      setFieldValue,
      subvariant,
    ]
  )
}
