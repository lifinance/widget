import { createContext, useContext } from 'react'

export const UTXOContext = createContext<any>(null)

export const useUTXOContext = () => {
  return useContext(UTXOContext)
}
