#!/usr/bin/env node
/**
 * Collects real `unavailableRoutes` payloads so the route-issue classifier can
 * be tested against what the API actually returns.
 *
 * The widget only ever sees these payloads, so replaying them through
 * `classifyRouteIssues` and `buildRouteIssueCard` reproduces a card exactly,
 * without a browser and without the network.
 *
 *   node scripts/collect-route-issues.js
 *   node scripts/collect-route-issues.js --api https://api-develop.jumper.xyz/pipeline/v1
 *
 * Writes packages/widget/src/utils/routeIssues/fixtures/live-payloads.json.
 * Re-run it when the API starts returning something new; the committed fixture
 * is what CI reads.
 */
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const apiArg = args.indexOf('--api')
const API = apiArg === -1 ? 'https://li.quest/v1' : args[apiArg + 1]
const INTEGRATOR = 'li.fi-playground'

const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../packages/widget/src/utils/routeIssues/fixtures/live-payloads.json'
)

const NATIVE = '0x0000000000000000000000000000000000000000'
const TOKENS = {
  usdcE: [1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
  usdcA: [42161, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'],
  usdcB: [8453, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'],
  usdcP: [137, '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'],
  wethE: [1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
  ethE: [1, NATIVE],
  sol: [1151111081099710, '11111111111111111111111111111111'],
  btc: [20000000000001, 'bitcoin'],
  sui: [9270000000000000, '0x2::sui::SUI'],
  plume: [98866, NATIVE],
}

/**
 * `usd: null` means one raw unit — the smallest amount that can be sent.
 * `bridges` / `exchanges` pin the tools, which is how an empty quote is
 * produced on demand: the card only exists when no route comes back.
 */
const CASES = [
  { from: 'usdcB', to: 'sol', usd: null, name: 'dust to solana' },
  { from: 'usdcE', to: 'btc', usd: null, name: 'dust to bitcoin' },
  { from: 'usdcE', to: 'btc', usd: 1e8, name: 'huge to bitcoin' },
  { from: 'usdcE', to: 'sui', usd: 1e8, name: 'huge to sui' },
  { from: 'plume', to: 'usdcE', usd: 1e8, name: 'huge from a long tail chain' },

  // The reported card: a send of one unit that read as thin liquidity.
  {
    from: 'usdcB',
    to: 'sol',
    usd: null,
    name: 'dust, one exchange with no liquidity',
    exchanges: ['okx'],
  },
  {
    from: 'usdcE',
    to: 'wethE',
    usd: 1e8,
    name: 'same chain swap, huge, one exchange',
    exchanges: ['1inch'],
  },
  {
    from: 'usdcA',
    to: 'usdcB',
    usd: null,
    name: 'dust, one bridge',
    bridges: ['across'],
  },
  {
    from: 'usdcA',
    to: 'usdcB',
    usd: 1e8,
    name: 'huge, bridge that names its cap',
    bridges: ['celercircle'],
  },
  {
    from: 'usdcA',
    to: 'usdcB',
    usd: 1e8,
    name: 'huge, bridge that names no cap',
    bridges: ['across'],
  },
  {
    from: 'usdcA',
    to: 'sol',
    usd: 50,
    name: 'one bridge that cannot serve the pair',
    bridges: ['eco'],
  },
  {
    from: 'usdcE',
    to: 'usdcP',
    usd: 50,
    name: 'receiver is a contract, one bridge',
    bridges: ['stargateV2'],
    fromAddress: '0xBD55C2F306C97Fd1d3E7A023f7c4834a2F472834',
    toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  },
]

/**
 * Keep only what `collectEntries` reads. A raw response carries the whole
 * action and estimate for every failed sub-path, which is megabytes of noise
 * that no rule ever looks at.
 */
const trim = (unavailableRoutes) => {
  const seenReasons = new Set()
  const filteredOut = []
  for (const item of unavailableRoutes.filteredOut ?? []) {
    const key = `${item.reason}|${item.overallPath}`
    if (!seenReasons.has(key)) {
      seenReasons.add(key)
      filteredOut.push({ reason: item.reason, overallPath: item.overallPath })
    }
  }

  const seenErrors = new Set()
  const failed = []
  for (const route of unavailableRoutes.failed ?? []) {
    const subpaths = {}
    for (const [leg, errors] of Object.entries(route.subpaths ?? {})) {
      const kept = []
      for (const error of errors ?? []) {
        const key = `${route.overallPath}|${error.code}|${error.message}`
        if (seenErrors.has(key)) {
          continue
        }
        seenErrors.add(key)
        kept.push({
          errorType: error.errorType,
          code: error.code,
          tool: error.tool,
          message: error.message,
        })
      }
      if (kept.length) {
        subpaths[leg] = kept
      }
    }
    if (Object.keys(subpaths).length) {
      failed.push({ overallPath: route.overallPath, subpaths })
    }
  }
  return { filteredOut, failed }
}

let remaining = Number.POSITIVE_INFINITY

const call = async (path, init) => {
  const res = await fetch(`${API}${path}`, init)
  const left = res.headers.get('ratelimit-remaining')
  if (left !== null) {
    remaining = Number(left)
  }
  return res
}

/** Stop while there is still budget, so a run never ends half-collected. */
const budgetSpent = () => remaining < 5

const rawAmount = (token, usd) => {
  if (usd === null) {
    return '1'
  }
  const units = BigInt(Math.round((usd / token.price) * 1e6))
  const scaled =
    token.decimals >= 6
      ? units * 10n ** BigInt(token.decimals - 6)
      : units / 10n ** BigInt(6 - token.decimals)
  return scaled.toString()
}

const main = async () => {
  const meta = {}
  for (const [name, [chain, address]] of Object.entries(TOKENS)) {
    const res = await call(
      `/token?chain=${chain}&token=${encodeURIComponent(address)}`
    )
    if (res.status !== 200) {
      throw new Error(`token ${name}: HTTP ${res.status}`)
    }
    const token = await res.json()
    meta[name] = {
      chain,
      address,
      symbol: token.symbol,
      decimals: token.decimals,
      price: Number(token.priceUSD),
    }
  }

  const collected = []
  for (const testCase of CASES) {
    if (budgetSpent()) {
      console.warn(`stopping early: rate limit budget spent (${remaining})`)
      break
    }
    const from = meta[testCase.from]
    const to = meta[testCase.to]
    const fromAmount = rawAmount(from, testCase.usd)
    const body = {
      fromChainId: from.chain,
      fromTokenAddress: from.address,
      fromAmount,
      toChainId: to.chain,
      toTokenAddress: to.address,
      options: {
        slippage: testCase.slippage ?? 0.005,
        integrator: INTEGRATOR,
        ...(testCase.bridges ? { bridges: { allow: testCase.bridges } } : {}),
        ...(testCase.exchanges
          ? { exchanges: { allow: testCase.exchanges } }
          : {}),
      },
    }
    if (testCase.fromAddress) {
      body.fromAddress = testCase.fromAddress
    }
    if (testCase.toAddress) {
      body.toAddress = testCase.toAddress
    }

    const res = await call('/advanced/routes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    // A non-200 recorded as an empty payload is indistinguishable from a real
    // "no routes", which is how an earlier sweep produced pages of nonsense.
    if (res.status !== 200) {
      throw new Error(
        `${testCase.name}: HTTP ${res.status} ${(await res.text()).slice(0, 160)}`
      )
    }
    const payload = await res.json()

    collected.push({
      name: testCase.name,
      request: {
        fromChainId: from.chain,
        fromTokenSymbol: from.symbol,
        fromTokenDecimals: from.decimals,
        fromTokenPriceUSD: String(from.price),
        fromAmount,
        toChainId: to.chain,
        fromAddress: testCase.fromAddress,
        toAddress: testCase.toAddress,
        slippage: testCase.slippage ?? 0.005,
        bridges: testCase.bridges,
        exchanges: testCase.exchanges,
      },
      routes: (payload.routes ?? []).length,
      unavailableRoutes: trim(payload.unavailableRoutes ?? {}),
    })
    console.warn(
      `${testCase.name}: routes=${collected.at(-1).routes} (budget ${remaining})`
    )
    await new Promise((r) => setTimeout(r, 600))
  }

  writeFileSync(OUT, `${JSON.stringify(collected, null, 2)}\n`)
  console.warn(`\nwrote ${collected.length} payloads to ${OUT}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
