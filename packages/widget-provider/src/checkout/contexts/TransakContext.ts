'use client'
import { type Context, createContext, useContext } from 'react'
import type { OnRampSession } from '../types.js'

export const TransakContext: Context<OnRampSession | null> =
  createContext<OnRampSession | null>(null)

export function useTransakSession(): OnRampSession | null {
  return useContext(TransakContext)
}
