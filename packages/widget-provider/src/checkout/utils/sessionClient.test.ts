import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { postCheckoutSession } from './sessionClient.js'

function mockFetch(
  status: number,
  body: unknown,
  { rejectJson = false }: { rejectJson?: boolean } = {}
) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: rejectJson
      ? vi.fn().mockRejectedValue(new Error('invalid json'))
      : vi.fn().mockResolvedValue(body),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const base = {
  endpointPath: '/v1/checkout/onramp/session' as const,
  apiKey: 'key-123',
  body: { amount: '10' },
}

describe('postCheckoutSession', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('base url normalization', () => {
    it('does not double the /v1 segment when baseUrl ends in /v1', async () => {
      const fetchMock = mockFetch(200, { id: 'a' })
      await postCheckoutSession({ ...base, baseUrl: 'https://li.quest/v1' })
      expect(fetchMock).toHaveBeenCalledWith(
        'https://li.quest/v1/checkout/onramp/session',
        expect.any(Object)
      )
    })

    it('strips trailing slashes from baseUrl', async () => {
      const fetchMock = mockFetch(200, { id: 'a' })
      await postCheckoutSession({ ...base, baseUrl: 'https://li.quest///' })
      expect(fetchMock).toHaveBeenCalledWith(
        'https://li.quest/v1/checkout/onramp/session',
        expect.any(Object)
      )
    })

    it('keeps a plain baseUrl untouched', async () => {
      const fetchMock = mockFetch(200, { id: 'a' })
      await postCheckoutSession({ ...base, baseUrl: 'https://li.quest' })
      expect(fetchMock).toHaveBeenCalledWith(
        'https://li.quest/v1/checkout/onramp/session',
        expect.any(Object)
      )
    })
  })

  describe('headers', () => {
    it('sets the api-key header and omits integrator when not provided', async () => {
      const fetchMock = mockFetch(200, { id: 'a' })
      await postCheckoutSession({ ...base, baseUrl: 'https://li.quest' })
      const headers = fetchMock.mock.calls[0][1].headers
      expect(headers['x-lifi-api-key']).toBe('key-123')
      expect(headers['x-lifi-integrator']).toBeUndefined()
    })

    it('sets the integrator header when provided', async () => {
      const fetchMock = mockFetch(200, { id: 'a' })
      await postCheckoutSession({
        ...base,
        baseUrl: 'https://li.quest',
        integrator: 'acme',
      })
      const headers = fetchMock.mock.calls[0][1].headers
      expect(headers['x-lifi-integrator']).toBe('acme')
    })
  })

  describe('success', () => {
    it('returns ok with the parsed data on a 2xx object body', async () => {
      mockFetch(200, { id: 'session-1' })
      const result = await postCheckoutSession<
        typeof base.body,
        { id: string }
      >({ ...base, baseUrl: 'https://li.quest' })
      expect(result).toEqual({ ok: true, data: { id: 'session-1' } })
    })
  })

  describe('failure', () => {
    it('returns the parsed api error on a non-2xx response', async () => {
      mockFetch(400, { error: 'bad request', code: 'INVALID' })
      const result = await postCheckoutSession({
        ...base,
        baseUrl: 'https://li.quest',
      })
      expect(result).toEqual({
        ok: false,
        status: 400,
        apiError: { error: 'bad request', code: 'INVALID' },
      })
    })

    it('returns a null api error when an error body has no error/code fields', async () => {
      mockFetch(500, { something: 'else' })
      const result = await postCheckoutSession({
        ...base,
        baseUrl: 'https://li.quest',
      })
      expect(result).toEqual({ ok: false, status: 500, apiError: null })
    })

    it('returns a null api error when the error body is not JSON', async () => {
      mockFetch(502, null, { rejectJson: true })
      const result = await postCheckoutSession({
        ...base,
        baseUrl: 'https://li.quest',
      })
      expect(result).toEqual({ ok: false, status: 502, apiError: null })
    })

    it('treats a 2xx with a non-object body as a failure (misconfigured proxy)', async () => {
      mockFetch(200, null)
      const result = await postCheckoutSession({
        ...base,
        baseUrl: 'https://li.quest',
      })
      expect(result).toEqual({ ok: false, status: 200, apiError: null })
    })

    it('treats a 2xx with a non-JSON body as a failure', async () => {
      mockFetch(200, null, { rejectJson: true })
      const result = await postCheckoutSession({
        ...base,
        baseUrl: 'https://li.quest',
      })
      expect(result).toEqual({ ok: false, status: 200, apiError: null })
    })
  })
})
