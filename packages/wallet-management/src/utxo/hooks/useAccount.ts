'use client';
import {
  type Config,
  type ResolvedRegister,
  getAccount,
  watchAccount,
} from '@wagmi/core';
import type { UseAccountParameters, UseAccountReturnType } from 'wagmi';
import { useConfig } from './useConfig.js';
import { useSyncExternalStoreWithTracked } from './useSyncExternalStoreWithTracked.js';

/** https://wagmi.sh/react/api/hooks/useAccount */
export function useAccount<C extends Config = ResolvedRegister['config']>(
  parameters: UseAccountParameters<C> = {},
): UseAccountReturnType<C> {
  const config = useConfig(parameters);

  return useSyncExternalStoreWithTracked(
    (onChange) => watchAccount(config, { onChange }),
    () => getAccount(config),
  );
}
