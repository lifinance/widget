import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditToolsStore } from '../store/editTools/EditToolsProvider.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import type { FormValues } from '../store/types.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import {
  addressPresets,
  amountPresets,
  chainsAndTokensPresets,
  defaultFormValueKeys,
  getDefaultFormValues,
  getResetFormValues,
  withFormUpdateKey,
} from '../utils/formValuePresets.js'

type FormUpdateMethod = 'formApi' | 'config'

export const useFormValuesDevPanel = (): {
  formUpdateMethod: FormUpdateMethod
  setFormUpdateMethod: Dispatch<SetStateAction<FormUpdateMethod>>
  chainKey: string
  fromAmountKey: string
  addressKey: string
  selectChainPreset: (key: string) => void
  selectAmountPreset: (key: string) => void
  selectAddressPreset: (key: string) => void
} => {
  const isDevView = useEditToolsStore((store) => store.isDevView)
  const { setFormValues: setFormValuesViaConfig } = useConfigActions()
  const { setFormValues: setFormValuesViaFormApiRef } = useEditToolsActions()
  const [formUpdateMethod, setFormUpdateMethod] =
    useState<FormUpdateMethod>('config')

  const [chainKey, setChainKey] = useState<string>(defaultFormValueKeys.chain)
  const [fromAmountKey, setFromAmountKey] = useState<string>(
    defaultFormValueKeys.amount
  )
  const [addressKey, setAddressKey] = useState<string>(
    defaultFormValueKeys.address
  )

  const applyFormValues = useCallback(
    (next: FormValues): void => {
      const apply =
        formUpdateMethod === 'formApi'
          ? setFormValuesViaFormApiRef
          : setFormValuesViaConfig
      apply(withFormUpdateKey(next))
    },
    [formUpdateMethod, setFormValuesViaConfig, setFormValuesViaFormApiRef]
  )

  const applyRef = useRef(applyFormValues)
  applyRef.current = applyFormValues

  useEffect(() => {
    if (!isDevView) {
      return
    }
    applyRef.current(getDefaultFormValues())
    return () => {
      applyRef.current(withFormUpdateKey(getResetFormValues()))
    }
  }, [isDevView])

  const selectPreset = useCallback(
    (
      lookup: Record<string, FormValues>,
      setKey: Dispatch<SetStateAction<string>>,
      key: string
    ): void => {
      const preset = lookup[key]
      if (preset) {
        setKey(key)
        applyFormValues(preset)
      }
    },
    [applyFormValues]
  )

  const selectChainPreset = useCallback(
    (key: string): void => {
      selectPreset(chainsAndTokensPresets, setChainKey, key)
    },
    [selectPreset]
  )

  const selectAmountPreset = useCallback(
    (key: string): void => {
      selectPreset(amountPresets, setFromAmountKey, key)
    },
    [selectPreset]
  )

  const selectAddressPreset = useCallback(
    (key: string): void => {
      selectPreset(addressPresets, setAddressKey, key)
    },
    [selectPreset]
  )

  return {
    formUpdateMethod,
    setFormUpdateMethod,
    chainKey,
    fromAmountKey,
    addressKey,
    selectChainPreset,
    selectAmountPreset,
    selectAddressPreset,
  }
}
