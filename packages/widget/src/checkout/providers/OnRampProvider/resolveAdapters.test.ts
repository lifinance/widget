import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LoadedOnRampAdapter } from './types.js'

const fakeTransak: LoadedOnRampAdapter = {
  meta: {
    id: 'transak',
    name: 'Transak',
    description: '',
    features: [],
    recommended: true,
  },
  Wrap: ({ children }) => children as never,
}
const fakeMesh: LoadedOnRampAdapter = {
  meta: {
    id: 'mesh',
    name: 'Mesh',
    description: '',
    features: [],
  },
  Wrap: ({ children }) => children as never,
}

const transakLoader = vi.hoisted(() => ({
  loadTransakAdapter: vi.fn(),
}))
const meshLoader = vi.hoisted(() => ({
  loadMeshAdapter: vi.fn(),
}))

vi.mock('./TransakProvider/transakLoader.js', () => transakLoader)
vi.mock('./MeshProvider/meshLoader.js', () => meshLoader)

describe('resolveOnRampAdapters', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    transakLoader.loadTransakAdapter.mockReset()
    meshLoader.loadMeshAdapter.mockReset()
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('returns both adapters when both loaders resolve', async () => {
    transakLoader.loadTransakAdapter.mockResolvedValueOnce(fakeTransak)
    meshLoader.loadMeshAdapter.mockResolvedValueOnce(fakeMesh)

    const { resolveOnRampAdapters } = await import('./resolveAdapters.js')
    const result = await resolveOnRampAdapters()

    expect(result.map((a) => a.meta.id)).toEqual(['transak', 'mesh'])
  })

  it('drops an adapter that returns null (peer SDK missing)', async () => {
    transakLoader.loadTransakAdapter.mockResolvedValueOnce(null)
    meshLoader.loadMeshAdapter.mockResolvedValueOnce(fakeMesh)

    const { resolveOnRampAdapters } = await import('./resolveAdapters.js')
    const result = await resolveOnRampAdapters()

    expect(result.map((a) => a.meta.id)).toEqual(['mesh'])
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('warns and skips an adapter whose loader rejects', async () => {
    transakLoader.loadTransakAdapter.mockResolvedValueOnce(fakeTransak)
    meshLoader.loadMeshAdapter.mockRejectedValueOnce(new Error('boom'))

    const { resolveOnRampAdapters } = await import('./resolveAdapters.js')
    const result = await resolveOnRampAdapters()

    expect(result.map((a) => a.meta.id)).toEqual(['transak'])
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(String(warnSpy.mock.calls[0]?.[0])).toContain('mesh')
  })

  it('returns an empty list when both adapters are unavailable', async () => {
    transakLoader.loadTransakAdapter.mockResolvedValueOnce(null)
    meshLoader.loadMeshAdapter.mockResolvedValueOnce(null)

    const { resolveOnRampAdapters } = await import('./resolveAdapters.js')
    const result = await resolveOnRampAdapters()

    expect(result).toEqual([])
  })
})
