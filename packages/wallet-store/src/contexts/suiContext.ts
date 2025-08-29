import { createContext, useContext } from 'react'

export const SuiContext = createContext<any>(null)

export const useSuiContext = () => {
  return useContext(SuiContext)
}
