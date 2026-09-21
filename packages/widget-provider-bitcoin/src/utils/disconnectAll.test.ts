import { describe, expect, it, vi } from 'vitest'
import { disconnectAll } from './disconnectAll.js'

const connector = (id: string) => ({ id, name: id }) as any

describe('disconnectAll', () => {
  it('disconnects every connection', async () => {
    const a = connector('a')
    const b = connector('b')
    const seen: string[] = []
    await disconnectAll([a, b], async (c) => {
      seen.push(c.id)
    })
    expect(seen).toEqual(['a', 'b'])
  })

  it('resolves when a stale connector fails but another disconnects', async () => {
    const dead = connector('xverse')
    const alive = connector('unisat')
    const seen: string[] = []
    const attempt = vi.fn(async (c: any) => {
      seen.push(c.id)
      if (c.id === 'xverse') {
        throw new Error('ProviderNotFoundError')
      }
    })
    // A connection left behind by a removed extension must not report the
    // disconnect as failed, or the caller skips emitting its event and skips
    // the connect it was preparing for.
    await expect(disconnectAll([dead, alive], attempt)).resolves.toBeUndefined()
    expect(seen).toEqual(['xverse', 'unisat'])
  })

  it('reports the first failure when nothing could be disconnected', async () => {
    const one = connector('one')
    const two = connector('two')
    await expect(
      disconnectAll([one, two], async (c) => {
        throw new Error(c.id)
      })
    ).rejects.toThrow('one')
  })

  it('reports a lone connector that cannot be disconnected', async () => {
    await expect(
      disconnectAll([connector('unisat')], async () => {
        throw new Error('ProviderNotFoundError')
      })
    ).rejects.toThrow('ProviderNotFoundError')
  })

  it('resolves for no connections', async () => {
    const attempt = vi.fn()
    await expect(disconnectAll([], attempt)).resolves.toBeUndefined()
    expect(attempt).not.toHaveBeenCalled()
  })
})
