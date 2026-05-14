// biome-ignore-all lint/suspicious/noConsole: allowed in scripts
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspacePath = path.resolve(__dirname, '..', 'pnpm-workspace.yaml')
// NB: macOS path
const globalModules = path.join(
  os.homedir(),
  'Library/pnpm/global/5/node_modules'
)

const sdkPackages = [
  '@lifi/sdk',
  '@lifi/sdk-provider-bitcoin',
  '@lifi/sdk-provider-ethereum',
  '@lifi/sdk-provider-solana',
  '@lifi/sdk-provider-sui',
  '@lifi/sdk-provider-tron',
]
const sdkOverrides = Object.fromEntries(
  sdkPackages.map((pkg) => [pkg, `link:${path.join(globalModules, pkg)}`])
)

const action = process.argv[2]

if (!['link', 'unlink'].includes(action)) {
  console.error('Usage: node linkSdk.js <link|unlink>')
  process.exit(1)
}

const MARKER = '  # LOCAL ONLY — do not commit (sdk link)'

let content = fs.readFileSync(workspacePath, 'utf-8')

function removeOverrides(yaml) {
  let next = yaml.replace(/^\s*# LOCAL ONLY.*\(sdk link\).*\r?\n/gm, '')
  for (const pkg of sdkPackages) {
    const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    next = next.replace(
      new RegExp(`^\\s+['"]?${escaped}['"]?\\s*:.*\\r?\\n`, 'gm'),
      ''
    )
  }
  return next
}

content = removeOverrides(content)

if (!content.endsWith('\n')) {
  content += '\n'
}

if (action === 'link') {
  const lines = sdkPackages.map((pkg) => `  '${pkg}': '${sdkOverrides[pkg]}'`)
  const block = `${MARKER}\n${lines.join('\n')}\n`

  // Anchor on a real top-level "overrides:" key. Tolerates trailing whitespace
  // and CRLF on the header line.
  const headerMatch = content.match(/^overrides:[ \t]*\r?\n/m)
  if (headerMatch) {
    const insertPoint = headerMatch.index + headerMatch[0].length
    content = content.slice(0, insertPoint) + block + content.slice(insertPoint)
  } else {
    content += `overrides:\n${block}`
  }
  console.log(
    'Linked SDK packages via pnpm-workspace.yaml overrides. DO NOT commit pnpm-workspace.yaml while linked.'
  )
} else {
  console.log('Unlinked SDK packages from pnpm-workspace.yaml overrides')
}

fs.writeFileSync(workspacePath, content)
