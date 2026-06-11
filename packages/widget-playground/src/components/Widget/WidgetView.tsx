import type { FieldNames, FormState, WidgetDrawer } from '@lifi/widget'
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget'
import { Box } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useFormValues } from '../../store/editTools/useFormValues.js'
import { useSkeletonToolValues } from '../../store/editTools/useSkeletonToolValues.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { useConfigMode } from '../../store/widgetConfig/useConfigValues.js'
import { isJumperMode } from '../../utils/mode.js'
import { ViewTierRail } from '../ViewTierRail/ViewTierRail.js'
import { WidgetViewContainer } from './WidgetViewContainer.js'

export function WidgetView(): JSX.Element {
  const { config } = useConfig()
  const { mode } = useConfigMode()
  const drawerRef = useRef<WidgetDrawer>(null)
  const formRef = useRef<FormState>(null)
  const { isSkeletonShown } = useSkeletonToolValues()
  const { formValues } = useFormValues()

  const showRail = isJumperMode(mode)

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
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {showRail ? <ViewTierRail /> : null}
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
      </Box>
    </WidgetViewContainer>
  )
}
