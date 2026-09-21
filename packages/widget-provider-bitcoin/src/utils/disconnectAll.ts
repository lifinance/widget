import type { Connector } from '@bigmi/client'

// Bigmi detaches a connection even when the wallet's own `disconnect()`
// throws, so the store ends up consistent either way. A wallet that has gone
// away therefore must not stop the caller from continuing — it would abort the
// `connect()` a disconnect is usually preparing for.
export const disconnectAll = async (
  connectors: readonly Connector[],
  disconnectOne: (connector: Connector) => Promise<void>
): Promise<void> => {
  for (const connector of connectors) {
    try {
      await disconnectOne(connector)
    } catch {
      // Intentionally ignored: bigmi has already cleared the connection.
    }
  }
}
