import { describe, expect, it } from 'vitest'
import { getInstalledConnectors } from './getInstalledConnectors.js'

const connector = (id: string, getProvider: () => Promise<unknown>) =>
  ({ id, name: id, getProvider }) as any

describe('getInstalledConnectors', () => {
  it('keeps a connector whose provider resolves', async () => {
    const present = connector('xverse', async () => ({ request: () => {} }))
    await expect(getInstalledConnectors([present])).resolves.toEqual([present])
  })

  it('drops a connector whose provider is undefined', async () => {
    const absent = connector('unisat', async () => undefined)
    await expect(getInstalledConnectors([absent])).resolves.toEqual([])
  })

  it('drops a connector whose getProvider throws', async () => {
    const throwing = connector('dynamic', async () => {
      throw new Error('ProviderNotFoundError')
    })
    await expect(getInstalledConnectors([throwing])).resolves.toEqual([])
  })

  it('preserves the order of the connectors it keeps', async () => {
    const a = connector('a', async () => ({}))
    const b = connector('b', async () => undefined)
    const c = connector('c', async () => ({}))
    await expect(getInstalledConnectors([a, b, c])).resolves.toEqual([a, c])
  })

  it('returns an empty list for no connectors', async () => {
    await expect(getInstalledConnectors([])).resolves.toEqual([])
  })
})
