'use client'
import { type Context, createContext, useContext } from 'react'
import type { OnRampFlowValue } from '../types.js'

export type TransakContextValue = OnRampFlowValue

export const TransakContext: Context<TransakContextValue | null> =
  createContext<TransakContextValue | null>(null)

export function useMaybeTransak(): TransakContextValue | null {
  return useContext(TransakContext)
}
