import { useEffect, useRef, useState } from 'react'
import type { FormFieldArray, FormFieldNames } from '../stores/form/types.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useFormStore } from '../stores/form/useFormStore.js'

export const useDebouncedWatch = <T extends FormFieldNames[]>(
  delay: number,
  ...name: T
): FormFieldArray<T> => {
  const watchedValue = useFieldValues(...name)
  const immediateWrites = useFormStore((store) => store.immediateWrites)
  const [debouncedValue, setDebouncedValue] = useState(watchedValue)
  const debouncedValueRef = useRef<typeof watchedValue>(null)
  const isMounted = useRef(false)
  const handledWrites = useRef(immediateWrites)

  useEffect(() => {
    // A settled write is not a keystroke, so waiting the delay out only adds
    // lag. Consume the bump, or the next keystroke would skip the delay too.
    const isImmediate = immediateWrites !== handledWrites.current
    handledWrites.current = immediateWrites

    if (isMounted.current) {
      const hasWatchedValue = watchedValue.some((value) => value)
      if (hasWatchedValue && !isImmediate) {
        const handler = setTimeout(() => {
          setDebouncedValue(watchedValue)
        }, delay)
        return () => clearTimeout(handler)
      }
      debouncedValueRef.current = watchedValue
      setDebouncedValue(watchedValue)
      return undefined
    }
    isMounted.current = true
    return undefined
  }, [delay, watchedValue, immediateWrites])

  return debouncedValue
}
