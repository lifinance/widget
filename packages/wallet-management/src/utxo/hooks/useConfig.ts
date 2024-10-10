'use client'
import { useContext } from 'react'
import type {
  Config,
  ResolvedRegister,
  UseConfigParameters,
  UseConfigReturnType,
} from 'wagmi'
import { BigmiContext } from '../context.js'
import { BigmiProviderNotFoundError } from '../errors/context.js'

/** https://wagmi.sh/react/api/hooks/useConfig */
export function useConfig<C extends Config = ResolvedRegister['config']>(
  parameters: UseConfigParameters<C> = {}
): UseConfigReturnType<C> {
  // biome-ignore lint/correctness/useHookAtTopLevel:
  const config = parameters.config ?? useContext(BigmiContext)
  if (!config) {
    throw new BigmiProviderNotFoundError()
  }
  return config as UseConfigReturnType<C>
}
