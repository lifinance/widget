import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number) {
  const callbacRef = useRef<() => void>(null)

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbacRef.current = callback
  })

  useEffect(() => {
    if (!delay) {
      return () => {}
    }

    const interval = setInterval(() => {
      callbacRef.current?.()
    }, delay)
    return () => clearInterval(interval)
  }, [delay])
}
