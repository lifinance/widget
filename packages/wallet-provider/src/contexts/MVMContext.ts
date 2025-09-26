import { createContext, useContext } from 'react'

export const MVMContext = createContext<any>(null)

export const useMVMContext = () => {
  return useContext(MVMContext)
}
