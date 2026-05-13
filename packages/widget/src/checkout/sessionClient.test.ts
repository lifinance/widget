import { postCheckoutSession } from '@lifi/widget-provider/checkout'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
    const data = { widgetUrl: 'https://onramp.example/iframe' }
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => data,
    })

    const result = await postCheckoutSession(baseArgs)

    expect(result).toEqual({ ok: true, data })
  })

  it.each([
    ['https://api.example.com', 'https://api.example.com'],
    ['https://api.example.com/', 'https://api.example.com'],
    ['https://api.example.com/v1', 'https://api.example.com'],
    ['https://api.example.com/v1/', 'https://api.example.com'],
  ])('normalizes baseUrl %s before appending endpointPath', async (input, expectedBase) => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    })

    await postCheckoutSession({ ...baseArgs, baseUrl: input })

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${expectedBase}/v1/checkout/onramp/session`
    )
  })

  it('omits the integrator header when integrator is undefined', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    })

    await postCheckoutSession({ ...baseArgs, integrator: undefined })

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<
      string,
      string
    >
    expect(headers['x-lifi-integrator']).toBeUndefined()
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
})
