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

// Keeping the previous array when nothing changed stops every wallet's
// registration event from re-rendering the whole Bitcoin context.
export const sameConnectors = (
  a: readonly Connector[],
  b: readonly Connector[]
): boolean => a.length === b.length && a.every((c, i) => c === b[i])
