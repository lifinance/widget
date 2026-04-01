'use client'
import { createContext, useContext } from 'react'
import type { OnRampFlowValue } from '../types.js'

export type TransakContextValue = OnRampFlowValue

export const TransakContext = createContext<TransakContextValue | null>(null)

export function useMaybeTransak(): TransakContextValue | null {
  return useContext(TransakContext)
}
