import { useSyncExternalStore } from 'react'

let suiValues = {}
const listeners = new Set()

export const setSuiValues = (values: any) => {
  suiValues = values
  listeners.forEach((fn: any) => {
    fn()
  })
}

export const useSuiValues = () => {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    () => suiValues
  )
}
