import type { Connector } from '@bigmi/client'

/**
 * Asks each connector whether its wallet is actually present, rather than
 * re-deriving that from `window`. Every bigmi connector's `getProvider()`
 * delegates to `getInternalProvider()`, which resolves `undefined` when the
 * wallet is absent; `dynamic` throws instead, so a throw also means absent.
 */
export const getInstalledConnectors = async (
  connectors: readonly Connector[]
): Promise<Connector[]> => {
  const probed = await Promise.all(
    connectors.map(async (connector) => {
      try {
        return (await connector.getProvider()) ? connector : undefined
      } catch {
        return undefined
      }
    })
  )
  return probed.filter((connector): connector is Connector =>
    Boolean(connector)
  )
}
