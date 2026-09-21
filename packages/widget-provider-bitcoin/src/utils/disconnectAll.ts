import type { Connector } from '@bigmi/client'

// Bigmi keeps a failed connector's connection, so following the active one
// would retry it forever and never reach the rest. Take every connector and
// give each its own attempt, then report the first failure.
export const disconnectAll = async (
  connectors: readonly Connector[],
  disconnectOne: (connector: Connector) => Promise<void>
): Promise<void> => {
  let firstError: unknown
  for (const connector of connectors) {
    try {
      await disconnectOne(connector)
    } catch (error) {
      firstError ??= error
    }
  }
  if (firstError) {
    throw firstError
  }
}
