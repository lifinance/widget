import express from 'express'
import {
  loadCryptoCurrencies,
  ResolveError,
  resolveTokenToTransak,
} from './resolve.js'
import {
  clearCachedToken,
  createSession,
  getAccessToken,
  TransakHttpError,
} from './transak.js'
import type { OnrampSessionRequest } from './types.js'

const PORT = Number(process.env.PORT) || 8080
const REFERRER_DOMAIN = process.env.REFERRER_DOMAIN
const ALLOWED_ORIGIN_PATTERN = /^https?:\/\/localhost(:\d+)?$/
const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/

// Error simulation mode: 'timeout' | 'auth_error' | 'config_error' | undefined
const SIMULATE_ERROR = process.env.SIMULATE_ERROR?.trim().toLowerCase()
const SIMULATE_TIMEOUT_MS = Number(process.env.SIMULATE_TIMEOUT_MS) || 30_000

// Real Core endpoint configuration
const USE_REAL_CORE = process.env.USE_REAL_CORE?.trim().toLowerCase() === 'true'
const CORE_API_URL = process.env.CORE_API_URL?.trim()

if (USE_REAL_CORE && !CORE_API_URL) {
  console.error('USE_REAL_CORE is enabled but CORE_API_URL is not set')
  process.exit(1)
}

function validateEnv(): { apiKey: string; apiSecret: string } | null {
  // Transak credentials not required when proxying to real Core
  if (USE_REAL_CORE) {
    return null
  }

  const apiKey = process.env.TRANSAK_API_KEY
  const apiSecret = process.env.TRANSAK_API_SECRET
  const missing: string[] = []
  if (!apiKey) {
    missing.push('TRANSAK_API_KEY')
  }
  if (!apiSecret) {
    missing.push('TRANSAK_API_SECRET')
  }
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(', ')}`)
    console.error(
      'Copy .env.example to .env and fill in your Transak staging credentials.'
    )
    process.exit(1)
  }
  return { apiKey: apiKey!, apiSecret: apiSecret! }
}

const credentials = validateEnv()

function validateRequest(body: unknown): body is OnrampSessionRequest {
  if (!body || typeof body !== 'object') {
    return false
  }
  const b = body as Record<string, unknown>
  return (
    typeof b.walletAddress === 'string' &&
    typeof b.tokenAddress === 'string' &&
    typeof b.chainId === 'number' &&
    typeof b.integrator === 'string'
  )
}

const app = express()

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGIN_PATTERN.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  next()
})

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

async function proxyToCore(
  body: OnrampSessionRequest,
  res: express.Response
): Promise<void> {
  try {
    const response = await fetch(`${CORE_API_URL}/v1/path/onramp-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    console.error('Failed to proxy to Core:', err)
    res.status(502).json({
      error: 'Failed to connect to Core API',
      code: 'PROXY_ERROR',
    })
  }
}

function simulateTimeout(): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Simulated network timeout'))
    }, SIMULATE_TIMEOUT_MS)
  })
}

app.post('/v1/path/onramp-session', async (req, res) => {
  try {
    // Handle error simulation modes
    if (SIMULATE_ERROR === 'timeout') {
      console.warn(`Simulating timeout (${SIMULATE_TIMEOUT_MS}ms)...`)
      try {
        await simulateTimeout()
      } catch {
        res.status(504).json({
          error: 'Request timed out',
          code: 'TIMEOUT_ERROR',
        })
        return
      }
    }

    if (SIMULATE_ERROR === 'auth_error') {
      res.status(401).json({
        error: 'Session expired or invalid',
        code: 'AUTH_ERROR',
      })
      return
    }

    if (SIMULATE_ERROR === 'config_error') {
      res.status(500).json({
        error: 'Server configuration error: missing credentials',
        code: 'CONFIG_ERROR',
      })
      return
    }

    const body = req.body

    if (!validateRequest(body)) {
      res.status(400).json({
        error:
          'Missing or invalid fields: walletAddress (string), tokenAddress (string), chainId (number), integrator (string required for tracking)',
        code: 'VALIDATION_ERROR',
      })
      return
    }

    // Proxy to real Core endpoint if configured
    if (USE_REAL_CORE) {
      await proxyToCore(body, res)
      return
    }

    // integrator is validated above and will be forwarded to Core in production.
    // The mock server does not use it but requires it to match the real API contract.

    // TODO: Only validates EVM addresses for now. Extend when non-EVM chains (Solana, Sui, etc.) are supported.
    if (
      body.walletAddress.startsWith('0x') &&
      !EVM_ADDRESS_PATTERN.test(body.walletAddress)
    ) {
      res.status(400).json({
        error:
          'Invalid walletAddress: must be a valid EVM address (0x + 40 hex characters)',
        code: 'VALIDATION_ERROR',
      })
      return
    }

    let cryptoCurrencyCode: string
    let network: string
    try {
      const resolved = await resolveTokenToTransak(
        body.tokenAddress,
        body.chainId
      )
      cryptoCurrencyCode = resolved.cryptoCurrencyCode
      network = resolved.network
    } catch (err) {
      if (err instanceof ResolveError) {
        res.status(400).json({ error: err.message, code: 'RESOLVE_ERROR' })
        return
      }
      throw err
    }

    const widgetParams: Record<string, string | boolean> = {
      apiKey: credentials!.apiKey,
      productsAvailed: 'BUY',
      disableWalletAddressForm: true,
      hideMenu: true,
      walletAddress: body.walletAddress,
      cryptoCurrencyCode,
      network,
    }
    if (REFERRER_DOMAIN) {
      widgetParams.referrerDomain = REFERRER_DOMAIN
    }

    let accessToken = await getAccessToken(
      credentials!.apiKey,
      credentials!.apiSecret
    )

    try {
      const result = await createSession(accessToken, widgetParams)
      res.json({ widgetUrl: result.widgetUrl })
    } catch (err) {
      // Retry once with a fresh token on auth failure
      if (err instanceof TransakHttpError && err.status === 401) {
        clearCachedToken()
        accessToken = await getAccessToken(
          credentials!.apiKey,
          credentials!.apiSecret
        )
        const result = await createSession(accessToken, widgetParams)
        res.json({ widgetUrl: result.widgetUrl })
        return
      }
      throw err
    }
  } catch (err) {
    console.error('Unhandled error in onramp-session:', err)
    res
      .status(500)
      .json({ error: 'Internal server error', code: 'INTERNAL_ERROR' })
  }
})

async function start(): Promise<void> {
  await loadCryptoCurrencies()
  app.listen(PORT, () => {
    console.warn(`Mock onramp session server listening on port ${PORT}`)
    console.warn(`  POST http://localhost:${PORT}/v1/path/onramp-session`)
    console.warn(`  GET  http://localhost:${PORT}/health`)
    console.warn('')
    if (USE_REAL_CORE) {
      console.warn(`  Mode: PROXY to Core API at ${CORE_API_URL}`)
    } else {
      console.warn('  Mode: MOCK (using Transak staging API directly)')
    }
    if (SIMULATE_ERROR) {
      console.warn(`  Error simulation: ${SIMULATE_ERROR.toUpperCase()}`)
      if (SIMULATE_ERROR === 'timeout') {
        console.warn(`  Timeout delay: ${SIMULATE_TIMEOUT_MS}ms`)
      }
    }
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
