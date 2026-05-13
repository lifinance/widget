'use client'
import { type Context, createContext, useContext } from 'react'
import type { OnRampSession } from '../types.js'

export const MeshContext: Context<OnRampSession | null> =
  createContext<OnRampSession | null>(null)

export function useMeshSession(): OnRampSession | null {
  return useContext(MeshContext)
}
