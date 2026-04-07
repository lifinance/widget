import { useImperativeHandle } from 'react'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { formDefaultValues } from '../../stores/form/createFormStore.js'
import type { FormRef } from '../../types/widget.js'
import type { FormStoreStore, GenericFormValue } from './types.js'

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

        formStore
          .getState()
          .setFieldValue(fieldName, sanitizedValue, fieldValueOptions)
      },
    }
  }, [formStore, setSelectedBookmark])
}
