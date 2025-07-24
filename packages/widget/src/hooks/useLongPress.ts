import { useCallback, useRef } from 'react'

export const useLongPress = (callback = () => {}, ms = 500) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isPressedRef = useRef(false)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)

  const start = useCallback(
    (e: React.PointerEvent) => {
      isPressedRef.current = true
      startPosRef.current = { x: e.clientX, y: e.clientY }
      timerRef.current = setTimeout(() => {
        if (isPressedRef.current) {
          callback()
        }
      }, ms)
    },
    [callback, ms]
  )

  const clear = useCallback(() => {
    isPressedRef.current = false
    startPosRef.current = null
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  // Based on https://github.com/minwork/react/tree/main/packages/use-long-press
  const move = useCallback(
    (e: React.PointerEvent) => {
      if (isPressedRef.current && startPosRef.current) {
        const dx = Math.abs(e.clientX - startPosRef.current.x)
        const dy = Math.abs(e.clientY - startPosRef.current.y)
        const limit = 25
        if (dx > limit || dy > limit) {
          clear() // cancel on movement
        }
      }
    },
    [clear]
  )

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onPointerMove: move,
  }
}
