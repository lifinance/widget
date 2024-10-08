'use client';
import { createContext, createElement } from 'react';
import type { ResolvedRegister, State } from 'wagmi';
import { Hydrate } from 'wagmi';

export const BigmiContext = createContext<
  ResolvedRegister['config'] | undefined
>(undefined);

export type WagmiProviderProps = {
  config: ResolvedRegister['config'];
  initialState?: State | undefined;
  reconnectOnMount?: boolean | undefined;
};

export function BigmiProvider(
  parameters: React.PropsWithChildren<WagmiProviderProps>,
) {
  const { children, config } = parameters;

  const props = { value: config };
  return createElement(
    Hydrate,
    parameters,
    createElement(BigmiContext.Provider, props, children),
  );
}
