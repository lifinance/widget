import type { Connector } from '@bigmi/client'

// Bigmi keeps a failed connector's connection, so following the active one
// would retry it forever and never reach the rest. Attempt every connector,
// and fail only when none could be disconnected: a connection left behind by
// a removed extension must not make a real disconnect look unsuccessful, or
// callers skip emitting their event and skip the connect they were preparing.
export const disconnectAll = async (
  connectors: readonly Connector[],
  disconnectOne: (connector: Connector) => Promise<void>
): Promise<void> => {
  let firstError: unknown
  let disconnected = 0
  for (const connector of connectors) {
    try {
      await disconnectOne(connector)
      disconnected += 1
    } catch (error) {
      firstError ??= error
    }
  }
  if (firstError && disconnected === 0) {
    throw firstError
  }
}
