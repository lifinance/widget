import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import type { FormFieldChanged } from '../../types/events.js'
import { WidgetEvent } from '../../types/events.js'
import type {
  DefaultValues,
  FormActions,
  FormFieldNames,
  GenericFormValue,
  SetOptions,
} from './types.js'
import { useFormStore } from './useFormStore.js'

export const useFieldActions = () => {
  const emitter = useWidgetEvents()
  const actions = useFormStore<FormActions>(
    (store) => ({
      getFieldValues: store.getFieldValues,
      isTouched: store.isTouched,
      isDirty: store.isDirty,
      resetField: store.resetField,
      setAsTouched: store.setAsTouched,
      setDefaultValues: store.setDefaultValues,
      setFieldValue: store.setFieldValue,
      setUserAndDefaultValues: store.setUserAndDefaultValues,
    }),
    shallow
  )

  const setFieldValueWithEmittedEvents = useCallback(
    (
      fieldName: FormFieldNames,
      newValue: GenericFormValue,
      options?: SetOptions
    ) => {
      const oldValue = actions.getFieldValues(fieldName)[0]

      actions.setFieldValue(fieldName, newValue, options)

      if (newValue !== oldValue) {
        emitter.emit(WidgetEvent.FormFieldChanged, {
          fieldName,
          newValue,
          oldValue,
        } as FormFieldChanged)
      }
    },
    [actions, emitter]
  )

  const setUserAndDefaultValuesWithEmittedEvents = useCallback(
    (formValues: Partial<DefaultValues>) => {
      const formValuesKeys = Object.keys(formValues) as FormFieldNames[]

      const changedValues = formValuesKeys.reduce(
        (accum, fieldName) => {
          const oldValue = actions.getFieldValues(fieldName)[0]
          const newValue = formValues[fieldName]

          if (newValue !== oldValue) {
            accum.push({ fieldName, newValue, oldValue })
          }

          return accum
        },
        [] as {
          fieldName: FormFieldNames
          newValue: GenericFormValue
          oldValue: GenericFormValue
        }[]
      )

      actions.setUserAndDefaultValues(formValues)

      changedValues.forEach(({ fieldName, newValue, oldValue }) => {
        emitter.emit(WidgetEvent.FormFieldChanged, {
          fieldName,
          newValue,
          oldValue,
        } as FormFieldChanged)
      })
    },
    [actions, emitter]
  )

  return {
    ...actions,
    setFieldValue: setFieldValueWithEmittedEvents,
    setUserAndDefaultValues: setUserAndDefaultValuesWithEmittedEvents,
  }
}
