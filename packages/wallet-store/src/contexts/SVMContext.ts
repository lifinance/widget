import { createContext, useContext } from 'react'

export const SVMContext = createContext<any>(null)

export const useSVMContext = () => {
  return useContext(SVMContext)
}
