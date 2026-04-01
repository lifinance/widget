'use client'
import { useMaybeMesh } from '../providers/OnRampProvider/MeshProvider/meshContext.js'
import { useOnRampContext } from '../providers/OnRampProvider/OnRampProvider.js'
import {
  type TransakContextValue,
  useMaybeTransak,
} from '../providers/OnRampProvider/TransakProvider/transakContext.js'
import type {
  OnRampFlowValue,
  OnRampProviderMeta,
} from '../providers/OnRampProvider/types.js'

export type { TransakContextValue }

export interface UseOnRampValues {
  /** True while optional on-ramp peers are being resolved */
  resolutionLoading: boolean
  /** Metadata for on-ramp providers that loaded successfully */
  availableProviders: OnRampProviderMeta[]
  isAvailable: (id: string) => boolean
  /** Returns the flow value for a given provider id, or null if not loaded */
  getProvider: (id: 'transak' | 'mesh') => OnRampFlowValue | null
  /** @deprecated use getProvider('transak') */
  transak: OnRampFlowValue | null
}

export function useOnRamp(): UseOnRampValues {
  const onRamp = useOnRampContext()
  const transakCtx = useMaybeTransak()
  const meshCtx = useMaybeMesh()

  return {
    resolutionLoading: onRamp.loading,
    availableProviders: onRamp.availableMetas,
    isAvailable: onRamp.isAvailable,
    getProvider: (id) => {
      if (id === 'transak') {
        return transakCtx
      }
      if (id === 'mesh') {
        return meshCtx
      }
      return null
    },
    transak: transakCtx,
  }
}
