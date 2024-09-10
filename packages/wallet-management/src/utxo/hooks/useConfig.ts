'use client';
import type { Config, ResolvedRegister } from '@wagmi/core';
import { useContext } from 'react';
import type { UseConfigParameters, UseConfigReturnType } from 'wagmi';
import { BigmiContext } from '../context.js';
import { BigmiProviderNotFoundError } from '../errors/context.js';

/** https://wagmi.sh/react/api/hooks/useConfig */
export function useConfig<C extends Config = ResolvedRegister['config']>(
  parameters: UseConfigParameters<C> = {},
): UseConfigReturnType<C> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const config = parameters.config ?? useContext(BigmiContext);
  if (!config) {
    throw new BigmiProviderNotFoundError();
  }
  return config as UseConfigReturnType<C>;
}
