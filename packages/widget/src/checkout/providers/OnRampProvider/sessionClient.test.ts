import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { postCheckoutSession } from './sessionClient.js'

describe('postCheckoutSession', () => {
  const originalFetch = globalThis.fetch
  const baseArgs = {
    baseUrl: 'https://api.example.com',
    endpointPath: '/v1/checkout/onramp/session' as const,
    apiKey: 'test-key',
    integrator: 'test',
    body: { hello: 'world' },
  }

  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('returns ok=true with parsed data on 2xx response', async () => {
    const data = { widgetUrl: 'https://transak.example/iframe' }
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => data,
    })

    const result = await postCheckoutSession(baseArgs)

    expect(result).toEqual({ ok: true, data })
  })

  it('strips trailing /v1 from baseUrl before appending endpointPath', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    })

    await postCheckoutSession({
      ...baseArgs,
      baseUrl: 'https://api.example.com/v1/',
    })

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'https://api.example.com/v1/checkout/onramp/session'
    )
  })

  it('returns parsed apiError on non-2xx with shape { error, code }', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => ({ error: 'invalid amount', code: 'BAD_INPUT' }),
    })

    const result = await postCheckoutSession(baseArgs)

    expect(result).toEqual({
      ok: false,
      status: 422,
      apiError: { error: 'invalid amount', code: 'BAD_INPUT' },
    })
  })

  it('returns apiError=null when error body is not a well-shaped object', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => 'plain string response',
    })

    const result = await postCheckoutSession(baseArgs)

    expect(result).toEqual({ ok: false, status: 500, apiError: null })
  })

  it('returns apiError=null when error body has no error/code fields', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ unrelated: 'field' }),
    })

    const result = await postCheckoutSession(baseArgs)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.apiError).toBeNull()
    }
  })

  it('coerces non-string error/code values to undefined', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 42, code: null }),
    })

    const result = await postCheckoutSession(baseArgs)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.apiError).toBeNull()
    }
  })

  it('returns apiError=null when response body cannot be parsed as JSON', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => {
        throw new SyntaxError('not json')
      },
    })

    const result = await postCheckoutSession(baseArgs)

    expect(result).toEqual({ ok: false, status: 502, apiError: null })
  })
})
