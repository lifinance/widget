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

  it('continues past a connector that cannot be reached', async () => {
    const dead = connector('xverse')
    const alive = connector('unisat')
    const seen: string[] = []
    const attempt = vi.fn(async (c: any) => {
      seen.push(c.id)
      if (c.id === 'xverse') {
        throw new Error('ProviderNotFoundError')
      }
    })
    await expect(disconnectAll([dead, alive], attempt)).resolves.toBeUndefined()
    expect(seen).toEqual(['xverse', 'unisat'])
  })

  it('resolves even when no connector can be reached', async () => {
    // Bigmi clears each connection regardless, so the caller must still be
    // able to carry on and connect something else.
    const seen: string[] = []
    await expect(
      disconnectAll([connector('a'), connector('b')], async (c) => {
        seen.push(c.id)
        throw new Error(c.id)
      })
    ).resolves.toBeUndefined()
    expect(seen).toEqual(['a', 'b'])
  })

  it('resolves for no connections', async () => {
    const attempt = vi.fn()
    await expect(disconnectAll([], attempt)).resolves.toBeUndefined()
    expect(attempt).not.toHaveBeenCalled()
  })
})
