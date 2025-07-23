import { useCallback, useRef } from 'react'

export const useLongPress = (callback = () => {}, ms = 500) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isPressedRef = useRef(false)

  const start = useCallback(() => {
    isPressedRef.current = true
    timerRef.current = setTimeout(() => {
      if (isPressedRef.current) {
        callback()
      }
    }, ms)
  }, [callback, ms])

  const clear = useCallback(() => {
    isPressedRef.current = false
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
  }
}
