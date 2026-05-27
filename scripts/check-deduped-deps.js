#!/usr/bin/env node
/**
 * check-deduped-deps
 *
 * Fails when a package that MUST be single-copy in the workspace has multiple
 * resolved versions in pnpm-lock.yaml.
 *
 * BACKGROUND
 *   Some packages keep state that can't be safely duplicated across bundles:
 *     - React context identity (wagmi, react)
 *     - module-level singletons (@lifi/sdk executionState)
 *     - cross-copy `instanceof` checks (viem, @lifi/types)
 *
 *   When two versions of such a package end up in the same Vite/webpack
 *   bundle, the symptoms range from a hard crash at mount (wagmi —
 *   "WagmiProviderNotFoundError") to silent runtime failures during specific
 *   user actions (@lifi/sdk — "Execution data not found").
 *
 *   Common trigger: a transitive dep (e.g. @reown/appkit-adapter-wagmi pins
 *   @wagmi/connectors which pins wagmi to an older exact version) drags in a
 *   second copy that examples don't see in their own package.json.
 *
 * USAGE
 *   pnpm check:deduped-deps          (exit 0 = clean, 1 = duplicates found)
 *
 * EXTENDING
 *   Add an entry to WATCHED_PACKAGES below. See the inline docs there.
 *
 * EXIT CODES
 *   0  no duplicates
 *   1  duplicates detected (printed to stderr)
 *   2  script error (missing lockfile, unrecognised format, or parse failure)
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// ─── Configuration ──────────────────────────────────────────────────────────
//
// Add a package here to enforce single-copy resolution for it across the
// workspace. Each entry supports the following options:
//
//   majorsAllowed: boolean (default false)
//     If true, different major versions are tolerated (e.g. wagmi v2 from
//     privy + wagmi v3 from widget) and duplicates are only reported WITHIN
//     a major. Use this when consumers can legitimately span majors.
//     Note: all 0.x versions share major "0", so 0.1.x and 0.2.x in the same
//     workspace are still flagged as in-major duplicates.
//     If false, any duplicate fails (use for tightly-versioned internal
//     packages like @lifi/sdk).
//
const WATCHED_PACKAGES = {
  wagmi: { majorsAllowed: true },
}

const MAX_IMPORTERS_SHOWN = 5

// ─── Paths ──────────────────────────────────────────────────────────────────

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LOCK_PATH = resolve(ROOT, 'pnpm-lock.yaml')

// ─── Output helpers ─────────────────────────────────────────────────────────

const IS_GHA = Boolean(process.env.GITHUB_ACTIONS)
const out = (msg) => process.stdout.write(`${msg}\n`)
const err = (msg) => process.stderr.write(`${msg}\n`)
// Emit a GHA error annotation so failures appear in the PR check summary.
const ghaError = (msg) => {
  if (IS_GHA) {
    process.stdout.write(`::error::${msg}\n`)
  }
}

// ─── Script error ────────────────────────────────────────────────────────────

class ScriptError extends Error {
  constructor(msg, code = 2) {
    super(msg)
    this.code = code
  }
}

// ─── Lockfile parsing ───────────────────────────────────────────────────────

/**
 * Parse `pnpm-lock.yaml` and return a map of `name → Set<version>` for all
 * resolved packages. We only need the `packages:` section, whose keys have
 * the shape `  name@version:` or `  'name@version':` (2-space indented,
 * optionally single-quoted). The snapshots: section uses the same indentation
 * but adds peer-hash suffixes — the section break fires before we reach it.
 */
function parseResolvedVersions() {
  if (!existsSync(LOCK_PATH)) {
    throw new ScriptError(`${LOCK_PATH} not found`)
  }
  let text
  try {
    text = readFileSync(LOCK_PATH, 'utf8')
  } catch (e) {
    throw new ScriptError(`cannot read ${LOCK_PATH}: ${e.message}`)
  }
  const lines = text.split('\n').map((l) => l.replace(/\r$/, ''))

  const versionLine = lines[0]?.trim() ?? ''
  if (!/^lockfileVersion:\s*['"]?9\./.test(versionLine)) {
    throw new ScriptError(
      `unrecognised lockfile format ("${versionLine}") — parser was written for lockfileVersion 9.x; update this script for the new format`
    )
  }

  const versionsByName = new Map()

  let inPackages = false
  // Matches 2-space-indented package keys in the packages: section.
  // Both quoted and unquoted forms appear; versions are plain semver with no peer-hash suffix.
  const keyRe = /^ {2}'?((?:@[^/]+\/)?[^@\s/]+)@([^':]+?)'?:$/

  for (const line of lines) {
    if (/^packages:\s*$/.test(line)) {
      inPackages = true
      continue
    }
    if (!inPackages) {
      continue
    }
    // Any non-indented line (next section header or end-of-file) ends the block.
    if (/^\S/.test(line)) {
      break
    }
    const m = line.match(keyRe)
    if (!m) {
      continue
    }
    const [, name, version] = m
    if (!versionsByName.has(name)) {
      versionsByName.set(name, new Set())
    }
    versionsByName.get(name).add(version)
  }
  if (versionsByName.size === 0) {
    throw new ScriptError(
      'packages: section yielded 0 entries — check lockfile format'
    )
  }
  return versionsByName
}

// ─── Version comparison ─────────────────────────────────────────────────────

function majorOf(version) {
  const m = version.match(/^(\d+)/)
  return m ? m[1] : version
}

/**
 * Semver comparison: numeric segments compared as numbers, pre-release tags
 * as strings. Stable releases rank higher than pre-releases with the same base
 * (e.g. `4.0.0 > 4.0.0-beta.11`), matching the semver spec.
 */
function compareSemver(a, b) {
  // build metadata is ignored by semver spec
  a = a.replace(/\+.*/, '')
  b = b.replace(/\+.*/, '')
  const [aBase, ...aPreParts] = a.split('-')
  const [bBase, ...bPreParts] = b.split('-')
  const aPre = aPreParts.join('-')
  const bPre = bPreParts.join('-')

  const aSegs = aBase.split('.').map(Number)
  const bSegs = bBase.split('.').map(Number)
  // Non-semver strings (e.g. protocol versions like "file:") produce NaN segments
  // which corrupt Array.sort. Treat them as equal so sorting still produces a stable result.
  if (aSegs.some(Number.isNaN) || bSegs.some(Number.isNaN)) {
    return 0
  }

  const baseMax = Math.max(aSegs.length, bSegs.length)
  for (let i = 0; i < baseMax; i++) {
    const diff = (aSegs[i] ?? 0) - (bSegs[i] ?? 0)
    if (diff !== 0) {
      return diff
    }
  }

  // Base equal — stable release beats pre-release
  if (aPre && !bPre) {
    return -1
  }
  if (!aPre && bPre) {
    return 1
  }
  if (!aPre && !bPre) {
    return 0
  }

  // Both pre-release — compare segment by segment
  const pa = aPre.split(/[.-]/)
  const pb = bPre.split(/[.-]/)
  const preMax = Math.max(pa.length, pb.length)
  for (let i = 0; i < preMax; i++) {
    // 11.4.4: a larger set of fields has higher precedence than a smaller set
    if (i >= pa.length) {
      return -1
    }
    if (i >= pb.length) {
      return 1
    }
    const x = pa[i]
    const y = pb[i]
    const nx = /^\d+$/.test(x) ? Number(x) : null
    const ny = /^\d+$/.test(y) ? Number(y) : null
    if (nx !== null && ny !== null) {
      if (nx !== ny) {
        return nx - ny
      }
    } else if (nx !== null && ny === null) {
      // semver 11.4.3: numeric identifiers have lower precedence than alphanumeric
      return -1
    } else if (nx === null && ny !== null) {
      return 1
    } else if (x !== y) {
      return x < y ? -1 : 1
    }
  }
  return 0
}

// ─── Duplicate detection ────────────────────────────────────────────────────

function findDuplicates(versionsByName) {
  const failures = []
  for (const [name, rules] of Object.entries(WATCHED_PACKAGES)) {
    const versions = versionsByName.get(name)
    if (!versions || versions.size < 2) {
      continue
    }
    if (rules.majorsAllowed) {
      const buckets = new Map()
      for (const v of versions) {
        const major = majorOf(v)
        if (!buckets.has(major)) {
          buckets.set(major, new Set())
        }
        buckets.get(major).add(v)
      }
      for (const [major, set] of buckets.entries()) {
        if (set.size > 1) {
          failures.push({ name, major, versions: [...set].sort(compareSemver) })
        }
      }
    } else {
      failures.push({ name, versions: [...versions].sort(compareSemver) })
    }
  }
  return failures
}

// ─── Trace formatting (uses `pnpm why -r --json`) ───────────────────────────
//
// Note: `pnpm why` lists workspace packages (direct or transitive) that
// depend on each resolved version. It does NOT show which transitive package
// PINS the version (e.g. `@wagmi/connectors@8.0.11 → wagmi@3.6.11`). For
// that, the operator should run `pnpm why -r <pkg>` manually — we surface
// this in the hint.

function whyJson(pkg) {
  try {
    const stdout = execFileSync('pnpm', ['why', '-r', '--json', pkg], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 64 * 1024 * 1024,
      timeout: 30_000,
    })
    let result
    try {
      result = JSON.parse(stdout)
    } catch {
      // Some pnpm versions output NDJSON (one JSON object per line) rather than
      // a single array. Try line-by-line as a fallback.
      result = stdout
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((l) => JSON.parse(l))
    }
    return Array.isArray(result) ? result : [result].filter(Boolean)
  } catch (e) {
    err(`  (pnpm why failed: ${e.message})`)
    return []
  }
}

function collectWorkspaceImporters(node, acc, seen = new Set()) {
  const id = node.version
    ? `${node.name}@${node.version}`
    : `${node.name}#${node.path ?? ''}`
  if (seen.has(id)) {
    return
  }
  seen.add(id)
  if (node.depField) {
    acc.add(`${node.name}${node.version ? `@${node.version}` : ''}`)
  }
  for (const child of node.dependents ?? []) {
    collectWorkspaceImporters(child, acc, seen)
  }
}

function formatTrace(failure) {
  const data = whyJson(failure.name)
  const matching = data.filter((entry) => {
    const bare = (entry.version ?? '').replace(/\(.*\)$/, '')
    return failure.versions.includes(bare)
  })
  if (matching.length === 0) {
    return data.length > 0
      ? '  (pnpm why succeeded but returned no matching version entries — run manually to debug)'
      : '  (pnpm why returned no trace data)'
  }

  const lines = []
  for (const entry of matching) {
    const importers = new Set()
    collectWorkspaceImporters(entry, importers)
    lines.push(`  ${failure.name}@${entry.version}`)
    if (importers.size === 0) {
      lines.push(
        '    (no workspace dependents found — pnpm why JSON format may have changed; run manually)'
      )
      continue
    }
    const sorted = [...importers].sort()
    const shown = sorted.slice(0, MAX_IMPORTERS_SHOWN)
    for (const i of shown) {
      lines.push(`    ← ${i}`)
    }
    const hidden = sorted.length - shown.length
    if (hidden > 0) {
      lines.push(`    … and ${hidden} more`)
    }
  }
  return lines.join('\n')
}

// ─── Main ───────────────────────────────────────────────────────────────────

function reportFailure(failure) {
  const suffix = failure.major ? ` (major ${failure.major})` : ''
  const highest = failure.versions[failure.versions.length - 1]
  const summary = `${failure.name}${suffix} has ${failure.versions.length} resolved versions: ${failure.versions.join(', ')}`
  err(`  ${summary}`)
  ghaError(`check-deduped-deps: ${summary}`)
  err('')
  err(formatTrace(failure))
  err('')
  err(
    `  Hint: run \`pnpm why -r ${failure.name}\` to see the full transitive chain`
  )
  err(`        and identify which dep pins the older version (often an exact`)
  err(`        peer dep from a UI kit like @reown/appkit-adapter-wagmi).`)
  err('')
  err(`        If the upstream pin cannot be removed, add an override in`)
  err(`        pnpm-workspace.yaml to collapse all copies onto one version:`)
  err(``)
  err(`          overrides:`)
  err(`            ${failure.name}: '^${highest}'`)
  err('')
}

function main() {
  let versionsByName
  try {
    versionsByName = parseResolvedVersions()
  } catch (e) {
    if (e instanceof ScriptError) {
      err(`✗ check-deduped-deps: ${e.message}`)
      ghaError(`check-deduped-deps: ${e.message}`)
      process.exit(e.code)
    }
    throw e
  }

  const failures = findDuplicates(versionsByName)

  if (failures.length === 0) {
    const watched = Object.keys(WATCHED_PACKAGES).join(', ')
    out(`✓ check-deduped-deps: no duplicates for [${watched}]`)
    process.exit(0)
  }

  err('✗ check-deduped-deps: duplicate resolutions detected\n')
  for (const failure of failures) {
    reportFailure(failure)
  }
  process.exit(1)
}

main()
