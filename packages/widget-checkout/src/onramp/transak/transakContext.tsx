'use client'
import { createContext, useContext } from 'react'

export interface TransakContextValue {
  openDepositFlow: () => void
  close: () => void
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

export const TransakContext = createContext<TransakContextValue | null>(null)

export function useMaybeTransak(): TransakContextValue | null {
  return useContext(TransakContext)
}
