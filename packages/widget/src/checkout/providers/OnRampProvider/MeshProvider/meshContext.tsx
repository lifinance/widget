'use client'
import { type Context, createContext, useContext } from 'react'
import type { OnRampFlowValue } from '../types.js'

export type MeshContextValue = OnRampFlowValue

export const MeshContext: Context<MeshContextValue | null> =
  createContext<MeshContextValue | null>(null)

export function useMaybeMesh(): MeshContextValue | null {
  return useContext(MeshContext)
}
