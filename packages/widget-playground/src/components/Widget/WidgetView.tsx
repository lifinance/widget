import type { FieldNames, FormState, WidgetDrawer } from '@lifi/widget'
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget'
import type { JSX } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { CheckoutWalletProvider } from '../../providers/ExternalWalletProvider/CheckoutWalletProvider.js'
import { useFormValues } from '../../store/editTools/useFormValues.js'
import { useSkeletonToolValues } from '../../store/editTools/useSkeletonToolValues.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { usePlaygroundWidgetMode } from '../../store/widgetConfig/useConfigValues.js'
import { CheckoutWidgetView } from './CheckoutWidgetView.js'
import { WidgetViewContainer } from './WidgetViewContainer.js'

export function WidgetView(): JSX.Element {
  const { config } = useConfig()
  const { playgroundWidgetMode } = usePlaygroundWidgetMode()
  const drawerRef = useRef<WidgetDrawer>(null)
  const formRef = useRef<FormState>(null)
  const { isSkeletonShown } = useSkeletonToolValues()
  const { formValues } = useFormValues()

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer()
  }, [])

  useEffect(() => {
    if (formRef.current && formValues) {
      Object.entries(formValues).forEach(([fieldName, fieldValue]) => {
        if (fieldName !== 'formUpdateKey') {
          formRef.current?.setFieldValue(fieldName as FieldNames, fieldValue, {
            setUrlSearchParam: true,
          })
        }
      })
    }
  }, [formValues])

  if (playgroundWidgetMode === 'checkout') {
    return (
      <WidgetViewContainer>
        <CheckoutWalletProvider>
          <CheckoutWidgetView />
        </CheckoutWalletProvider>
      </WidgetViewContainer>
    )
  }

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      {!isSkeletonShown ? (
        <LiFiWidget
          config={config}
          ref={drawerRef}
          integrator="li.fi-playground"
          formRef={formRef}
          open
        />
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config} /> : null}
    </WidgetViewContainer>
  )
}
