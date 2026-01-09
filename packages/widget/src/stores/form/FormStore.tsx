import type { PropsWithChildren } from 'react'
import { useMemo, useRef } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormRef, ToAddress } from '../../types/widget.js'
import { createFormStore, formDefaultValues } from './createFormStore.js'
import { FormStoreContext } from './FormStoreContext.js'
import { FormUpdater } from './FormUpdater.js'
import type { DefaultValues, FormStoreStore } from './types.js'
import { useFormRef } from './useFormRef.js'

// decorates and initialise the form date for use in the form store
const initialiseDefaultValues = (
  defaultValues: Partial<DefaultValues>,
  fromAmount?: number | string,
  toAmount?: number | string,
  toAddress?: ToAddress
) => ({
  ...formDefaultValues,
  ...defaultValues,
  fromAmount:
    (typeof fromAmount === 'number' ? fromAmount?.toPrecision() : fromAmount) ||
    formDefaultValues.fromAmount,
  toAmount:
    (typeof toAmount === 'number' ? toAmount?.toPrecision() : toAmount) ||
    formDefaultValues.toAmount,
  // Prevent setting address when the field is hidden
  toAddress: toAddress?.address || formDefaultValues.toAddress,
})

interface FormStoreProviderProps extends PropsWithChildren {
  formRef?: FormRef
}

export const FormStoreProvider: React.FC<FormStoreProviderProps> = ({
  children,
  formRef,
}) => {
  const widgetConfig = useWidgetConfig()

  const {
    fromChain,
    fromToken,
    toChain,
    toToken,
    fromAmount,
    toAmount,
    toAddress,
    formUpdateKey,
  } = widgetConfig

  const storeRef = useRef<FormStoreStore>(null)

  const configHasFromChain = Object.hasOwn(widgetConfig, 'fromChain')
  const configHasFromToken = Object.hasOwn(widgetConfig, 'fromToken')
  const configHasFromAmount = Object.hasOwn(widgetConfig, 'fromAmount')
  const configHasToAmount = Object.hasOwn(widgetConfig, 'toAmount')
  const configHasToAddress = Object.hasOwn(widgetConfig, 'toAddress')
  const configHasToChain = Object.hasOwn(widgetConfig, 'toChain')
  const configHasToToken = Object.hasOwn(widgetConfig, 'toToken')

  // We use the presence/absence of a property to decide if the form values in state need to be updated
  // We only build and set a property on the memoized form values here if they are included in the
  // config - undefined is considered a valid value that will reset that form field
  // biome-ignore lint/correctness/useExhaustiveDependencies: formUpdateKey is needed here.
  const reactiveFormValues = useMemo(
    () => ({
      ...(configHasFromChain ? { fromChain } : undefined),
      ...(configHasFromToken ? { fromToken } : undefined),
      ...(configHasFromAmount
        ? {
            fromAmount:
              (typeof fromAmount === 'number'
                ? fromAmount?.toPrecision()
                : fromAmount) || formDefaultValues.fromAmount,
          }
        : undefined),
      ...(configHasToAmount
        ? {
            toAmount:
              (typeof toAmount === 'number'
                ? toAmount?.toPrecision()
                : toAmount) || formDefaultValues.toAmount,
          }
        : undefined),
      ...(configHasToChain ? { toChain } : undefined),
      ...(configHasToToken ? { toToken } : undefined),
      ...(configHasToAddress
        ? {
            toAddress: toAddress?.address || formDefaultValues.toAddress,
          }
        : undefined),
    }),
    [
      fromAmount,
      toAmount,
      fromChain,
      fromToken,
      toAddress,
      toChain,
      toToken,
      // formUpdateKey should be a randomly assigned unique key. It can be used to force updates for the form field values
      formUpdateKey,
      configHasFromChain,
      configHasFromToken,
      configHasFromAmount,
      configHasToAmount,
      configHasToAddress,
      configHasToChain,
      configHasToToken,
    ]
  )

  if (!storeRef.current) {
    storeRef.current = createFormStore(
      initialiseDefaultValues(
        reactiveFormValues,
        fromAmount,
        toAmount,
        toAddress
      )
    )
  }

  useFormRef(storeRef.current, formRef)

  return (
    <FormStoreContext.Provider value={storeRef.current}>
      {children}
      <FormUpdater reactiveFormValues={reactiveFormValues} />
    </FormStoreContext.Provider>
  )
}
