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

let content = fs.readFileSync(workspacePath, 'utf-8')

function removeOverrides(yaml) {
  for (const pkg of sdkPackages) {
    const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    yaml = yaml.replace(new RegExp(`^  '${escaped}':.*\\n`, 'gm'), '')
  }
  return yaml
}

content = removeOverrides(content)

if (action === 'link') {
  const lines = sdkPackages.map((pkg) => `  '${pkg}': '${sdkOverrides[pkg]}'`)
  const overridesBlock = lines.join('\n')

  if (content.includes('overrides:')) {
    const insertPoint = content.indexOf('overrides:') + 'overrides:\n'.length
    content =
      content.slice(0, insertPoint) +
      overridesBlock +
      '\n' +
      content.slice(insertPoint)
  } else {
    content += `overrides:\n${overridesBlock}\n`
  }
  console.log('Linked SDK packages via pnpm-workspace.yaml overrides')
} else {
  console.log('Unlinked SDK packages from pnpm-workspace.yaml overrides')
}

fs.writeFileSync(workspacePath, content)
