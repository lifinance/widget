import type { Connector } from '@bigmi/client'

// `getProvider()` resolves undefined when the wallet is absent; `dynamic` throws.
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
