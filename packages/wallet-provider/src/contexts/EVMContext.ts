import { createContext, useContext } from 'react'

export const EVMContext = createContext<any>(null)

export const useEVMContext = () => {
  return useContext(EVMContext)
}
