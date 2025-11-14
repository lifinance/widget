import type { FieldNames, FormState, WidgetDrawer } from '@lifi/widget'
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget'
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { SuiProvider } from '@lifi/widget-provider-sui'
import { useCallback, useEffect, useRef } from 'react'
import { useFormValues } from '../../store/editTools/useFormValues.js'
import { useSkeletonToolValues } from '../../store/editTools/useSkeletonToolValues.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { WidgetViewContainer } from './WidgetViewContainer.js'

export function WidgetView() {
  const { config } = useConfig()
  const drawerRef = useRef<WidgetDrawer>(null)
  const formRef = useRef<FormState>(null)
  const { isSkeletonShown, isSkeletonSideBySide } = useSkeletonToolValues()
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

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      {!isSkeletonShown || isSkeletonSideBySide ? (
        <LiFiWidget
          config={config}
          ref={drawerRef}
          integrator="li.fi-playground"
          formRef={formRef}
          open
          providers={[
            EthereumProvider(),
            SuiProvider(),
            SolanaProvider(),
            BitcoinProvider(),
          ]}
        />
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config} /> : null}
    </WidgetViewContainer>
  )
}
