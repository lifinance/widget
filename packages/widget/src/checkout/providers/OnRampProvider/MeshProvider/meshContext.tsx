'use client'
import { createContext, useContext } from 'react'
import type { OnRampFlowValue } from '../types.js'

export type MeshContextValue = OnRampFlowValue

export const MeshContext = createContext<MeshContextValue | null>(null)

export function useMaybeMesh(): MeshContextValue | null {
  return useContext(MeshContext)
}
