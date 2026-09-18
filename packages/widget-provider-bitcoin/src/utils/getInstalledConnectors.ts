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
  const installed = probed.filter((connector): connector is Connector =>
    Boolean(connector)
  )
  // An integrator who still passes a connector that is now a default would
  // otherwise see the same wallet twice.
  const seen = new Set<string>()
  return installed.filter((connector) => {
    const id = connector.id ?? connector.name
    if (seen.has(id)) {
      return false
    }
    seen.add(id)
    return true
  })
}

// Keeping the previous array when nothing changed stops every wallet's
// registration event from re-rendering the whole Bitcoin context.
export const sameConnectors = (
  a: readonly Connector[],
  b: readonly Connector[]
): boolean => a.length === b.length && a.every((c, i) => c === b[i])
