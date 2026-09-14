#!/usr/bin/env node
/**
 * Collects real `unavailableRoutes` payloads so the route-issue classifier can
 * be tested against what the API actually returns.
 *
 * The widget only ever sees these payloads, so replaying one through
 * `classifyRouteIssues` and `buildRouteIssueCard` reproduces a card exactly,
 * without a browser and without the network.
 *
 *   node scripts/collect-route-issues.js
 *   node scripts/collect-route-issues.js --api https://api-develop.jumper.xyz/pipeline/v1
 *   node scripts/collect-route-issues.js --fresh     # ignore what is already there
 *
 * The routes endpoint allows about 75 requests an hour, far fewer than the
 * matrix below, so a run tops the fixture up and skips what it already has.
 * Re-run after the window resets until it reports nothing left to collect.
 * Run `pnpm check:write` afterwards — Biome owns the fixture's formatting and
 * JSON.stringify does not match it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const apiArg = args.indexOf('--api')
const API = apiArg === -1 ? 'https://li.quest/v1' : args[apiArg + 1]
const FRESH = args.includes('--fresh')
const INTEGRATOR = 'li.fi-playground'
// Without a key the routes endpoint allows 75 requests per ~80 minutes, in a
// fixed window that releases all at once — so spacing requests out buys
// nothing, and the whole matrix takes several windows. Set LIFI_API_KEY to
// collect it in one go.
const API_KEY = process.env.LIFI_API_KEY
const VERIFY = args.includes('--verify')
const SUGGESTIONS =
  '/tmp/claude-501/-Users-eugene-Projects/71d17826-4937-4a23-828e-04f08fcb6e62/scratchpad/suggestions.json'

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
  ethB: [8453, NATIVE],
  sol: [1151111081099710, '11111111111111111111111111111111'],
  btc: [20000000000001, 'bitcoin'],
  sui: [9270000000000000, '0x2::sui::SUI'],
  trx: [728126428, 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'],
  plume: [98866, NATIVE],
  ink: [57073, NATIVE],
  bera: [80094, NATIVE],
}

const EOA = '0xBD55C2F306C97Fd1d3E7A023f7c4834a2F472834'
const CONTRACT = '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE'

// Pinning a tool is what forces an empty quote, and an empty quote is the only
// state the card exists for.
const BRIDGES = [
  'across',
  'celercircle',
  'celercirclefast',
  'stargateV2',
  'mayan',
  'mayanMCTP',
  'garden',
  'eco',
  'symbiosis',
  'glacis',
  'relaydepository',
  'polymerStandard',
  'allbridge',
  'squid',
]
const EXCHANGES = [
  '1inch',
  'okx',
  'paraswap',
  'kyberswap',
  'enso',
  'bebop',
  'dodo',
  'openocean',
  'sushiswap',
  'gluex',
]

/** `usd: null` means one raw unit — the smallest amount that can be sent. */
const AMOUNTS = [
  ['dust', null],
  ['huge', 1e8],
]

const buildMatrix = () => {
  const cases = []
  for (const tool of BRIDGES) {
    for (const [band, usd] of AMOUNTS) {
      cases.push({
        name: `bridge ${tool}, ${band}`,
        from: 'usdcA',
        to: 'usdcB',
        usd,
        bridges: [tool],
      })
    }
  }
  for (const tool of EXCHANGES) {
    for (const [band, usd] of AMOUNTS) {
      cases.push({
        name: `exchange ${tool}, ${band}`,
        from: 'usdcE',
        to: 'wethE',
        usd,
        exchanges: [tool],
      })
    }
  }
  const pairs = [
    ['usdcB', 'sol'],
    ['usdcE', 'btc'],
    ['usdcE', 'sui'],
    ['usdcE', 'trx'],
    ['sol', 'usdcB'],
    ['btc', 'usdcE'],
    ['usdcE', 'plume'],
    ['usdcE', 'ink'],
    ['usdcE', 'bera'],
    ['plume', 'usdcE'],
    ['ethE', 'usdcA'],
    ['ethB', 'usdcB'],
  ]
  for (const [from, to] of pairs) {
    for (const [band, usd] of AMOUNTS) {
      cases.push({ name: `${from} to ${to}, ${band}`, from, to, usd })
    }
  }
  // Request shape reaches the receiver and slippage rules, which no amount does.
  for (const [from, to] of [
    ['usdcE', 'usdcP'],
    ['usdcB', 'sol'],
    ['usdcA', 'usdcB'],
  ]) {
    cases.push({
      name: `${from} to ${to}, receiver is a contract`,
      from,
      to,
      usd: 50,
      bridges: ['stargateV2'],
      fromAddress: EOA,
      toAddress: CONTRACT,
    })
    cases.push({
      name: `${from} to ${to}, receiver differs from sender`,
      from,
      to,
      usd: 50,
      bridges: ['across'],
      fromAddress: CONTRACT,
      toAddress: EOA,
    })
    cases.push({
      name: `${from} to ${to}, slippage far too tight`,
      from,
      to,
      usd: 50,
      slippage: 0.00001,
    })
    cases.push({
      name: `${from} to ${to}, slippage very loose`,
      from,
      to,
      usd: 50,
      slippage: 0.3,
    })
  }
  return cases
}

let remaining = Number.POSITIVE_INFINITY

const call = async (path, init) => {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...(API_KEY ? { 'x-lifi-api-key': API_KEY } : {}),
    },
  })
  const left = res.headers.get('ratelimit-remaining')
  if (left !== null) {
    remaining = Number(left)
  }
  return res
}

/** Stop while there is still budget, so a run never ends half-collected. */
const budgetSpent = () => remaining < 3

const rawAmount = (token, usd) => {
  if (usd === null) {
    return '1'
  }
  const units = BigInt(Math.round((usd / token.price) * 1e6))
  const scaled =
    token.decimals >= 6
      ? units * 10n ** BigInt(token.decimals - 6)
      : units / 10n ** BigInt(6 - token.decimals)
  return (scaled > 0n ? scaled : 1n).toString()
}

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

/**
 * Re-requests each suggestion at the amount the card offers. A suggestion that
 * still returns nothing is one the user would apply and be no better off, which
 * no offline assertion can catch.
 */
const verify = async (meta) => {
  const suggestions = JSON.parse(readFileSync(SUGGESTIONS, 'utf8'))
  const byName = new Map(buildMatrix().map((entry) => [entry.name, entry]))
  const results = []
  for (const { name, suggested, sent } of suggestions) {
    if (budgetSpent()) {
      console.warn(`\nstopping: budget spent (${remaining} left)`)
      break
    }
    const testCase = byName.get(name)
    if (!testCase) {
      continue
    }
    const from = meta[testCase.from]
    const to = meta[testCase.to]
    const units = Number(suggested)
    const raw = BigInt(Math.round(units * 10 ** Math.min(from.decimals, 15)))
    const fromAmount = (
      from.decimals > 15 ? raw * 10n ** BigInt(from.decimals - 15) : raw
    ).toString()

    const res = await call('/advanced/routes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
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
        ...(testCase.fromAddress ? { fromAddress: testCase.fromAddress } : {}),
        ...(testCase.toAddress ? { toAddress: testCase.toAddress } : {}),
      }),
    })
    if (res.status !== 200) {
      console.warn(`${name}: HTTP ${res.status} — stopping`)
      break
    }
    const payload = await res.json()
    const routes = (payload.routes ?? []).length
    results.push({ name, suggested, routes })
    console.warn(
      `${routes > 0 ? 'WORKS ' : 'FAILS '} ${name} — applied ${suggested} (sent ${sent}) -> routes=${routes}`
    )
    await new Promise((r) => setTimeout(r, 400))
  }
  const failed = results.filter((entry) => entry.routes === 0)
  console.warn(
    `\n${results.length - failed.length}/${results.length} suggestions produced routes`
  )
  for (const entry of failed) {
    console.warn(`  still empty: ${entry.name} at ${entry.suggested}`)
  }
}

const main = async () => {
  const existing =
    !FRESH && existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
  const have = new Set(existing.map((entry) => entry.name))
  const matrix = buildMatrix()
  const todo = VERIFY ? [] : matrix.filter((entry) => !have.has(entry.name))

  console.warn(
    `${have.size} collected, ${todo.length} to go, on ${API}${API_KEY ? ' (keyed)' : ' (no key — expect several windows)'}`
  )
  if (!VERIFY && !todo.length) {
    console.warn('nothing left to collect')
    return
  }

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

  if (VERIFY) {
    await verify(meta)
    return
  }

  const collected = [...existing]
  let added = 0
  for (const testCase of todo) {
    if (budgetSpent()) {
      console.warn(`\nstopping: rate limit budget spent (${remaining} left)`)
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
    // "no routes", which is how an earlier browser sweep produced pages of
    // nonsense. Stop instead, and keep everything collected so far.
    if (res.status !== 200) {
      console.warn(
        `\n${testCase.name}: HTTP ${res.status} — stopping, keeping ${added} new`
      )
      break
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
    added++
    console.warn(
      `${testCase.name}: routes=${collected.at(-1).routes} (budget ${remaining})`
    )
    await new Promise((r) => setTimeout(r, 400))
  }

  collected.sort((a, b) => a.name.localeCompare(b.name))
  writeFileSync(OUT, `${JSON.stringify(collected, null, 2)}\n`)
  console.warn(
    `\nadded ${added}, ${collected.length} of ${matrix.length} collected`
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
