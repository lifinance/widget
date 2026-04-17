import { useImperativeHandle } from 'react'
import { widgetEvents } from '../../hooks/useWidgetEvents.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { formDefaultValues } from '../../stores/form/createFormStore.js'
import type { FormFieldChanged } from '../../types/events.js'
import { WidgetEvent } from '../../types/events.js'
import type { FormRef } from '../../types/widget.js'
import type {
  FormFieldNames,
  FormStoreStore,
  GenericFormValue,
} from './types.js'

export const useFormRef = (
  formStore: FormStoreStore,
  formRef?: FormRef
): void => {
  const { setSelectedBookmark } = useBookmarkActions()

  useImperativeHandle(formRef, () => {
    const sanitizeValue: {
      [key: string]: (value: any) => GenericFormValue
    } = {
      fromAmount: (value) =>
        (typeof value === 'number' ? value?.toPrecision() : value) ||
        formDefaultValues.fromAmount,
      toAmount: (value) =>
        (typeof value === 'number' ? value?.toPrecision() : value) ||
        formDefaultValues.toAmount,
      toAddress: (value) => {
        const isToAddressObj = typeof value !== 'string'

        const address =
          (isToAddressObj ? value?.address : value) ||
          formDefaultValues.toAddress

        // we can assume that the toAddress has been passed as ToAddress object
        // and display it accordingly - this ensures that if a name is included
        // that it is displayed in the Send To Wallet form field correctly
        if (isToAddressObj) {
          setSelectedBookmark(value)
        }

        return address
      },
    }

    return {
      setFieldValue: (fieldName, value, options) => {
        const sanitizedValue = (
          sanitizeValue[fieldName] ? sanitizeValue[fieldName](value) : value
        ) as GenericFormValue

        const fieldValueOptions = options?.setUrlSearchParam
          ? { isTouched: options?.setUrlSearchParam }
          : undefined

        const oldValue = formStore
          .getState()
          .getFieldValues(fieldName as FormFieldNames)[0]

        formStore
          .getState()
          .setFieldValue(fieldName, sanitizedValue, fieldValueOptions)

        if (sanitizedValue !== oldValue) {
          widgetEvents.emit(WidgetEvent.FormFieldChanged, {
            fieldName,
            newValue: sanitizedValue,
            oldValue,
          } as FormFieldChanged)
        }
      },
    }
  }, [formStore, setSelectedBookmark])
}
