import type { FieldNames, FormState, WidgetDrawer } from '@lifi/widget'
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget'
import { useCallback, useEffect, useRef } from 'react'
import { useFormValues } from '../../store/editTools/uesFormValues'
import { useSkeletonToolValues } from '../../store/editTools/useSkeletonToolValues'
import { useConfig } from '../../store/widgetConfig/useConfig'
import { WidgetViewContainer } from './WidgetViewContainer'

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
        />
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config} /> : null}
    </WidgetViewContainer>
  )
}
