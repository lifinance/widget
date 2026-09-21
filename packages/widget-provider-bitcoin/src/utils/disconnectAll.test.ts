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

  it('keeps going when one connector fails', async () => {
    const dead = connector('xverse')
    const alive = connector('unisat')
    const seen: string[] = []
    const attempt = vi.fn(async (c: any) => {
      seen.push(c.id)
      if (c.id === 'xverse') {
        throw new Error('ProviderNotFoundError')
      }
    })
    await expect(disconnectAll([dead, alive], attempt)).rejects.toThrow(
      'ProviderNotFoundError'
    )
    // The healthy wallet must still have been disconnected.
    expect(seen).toEqual(['xverse', 'unisat'])
  })

  it('reports the first failure, not the last', async () => {
    const one = connector('one')
    const two = connector('two')
    await expect(
      disconnectAll([one, two], async (c) => {
        throw new Error(c.id)
      })
    ).rejects.toThrow('one')
  })

  it('resolves for no connections', async () => {
    const attempt = vi.fn()
    await expect(disconnectAll([], attempt)).resolves.toBeUndefined()
    expect(attempt).not.toHaveBeenCalled()
  })
})
