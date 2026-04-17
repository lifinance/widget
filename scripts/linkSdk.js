// biome-ignore-all lint/suspicious/noConsole: allowed in scripts
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.resolve(__dirname, '..', 'package.json')

const sdkOverrides = {
  '@lifi/sdk': 'link:../../Library/pnpm/global/5/node_modules/@lifi/sdk',
  '@lifi/sdk-provider-bitcoin':
    'link:../../Library/pnpm/global/5/node_modules/@lifi/sdk-provider-bitcoin',
  '@lifi/sdk-provider-ethereum':
    'link:../../Library/pnpm/global/5/node_modules/@lifi/sdk-provider-ethereum',
  '@lifi/sdk-provider-solana':
    'link:../../Library/pnpm/global/5/node_modules/@lifi/sdk-provider-solana',
  '@lifi/sdk-provider-sui':
    'link:../../Library/pnpm/global/5/node_modules/@lifi/sdk-provider-sui',
}

const action = process.argv[2]

if (!['link', 'unlink'].includes(action)) {
  console.error('Usage: node linkSdk.js <link|unlink>')
  process.exit(1)
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

if (!packageJson.pnpm) {
  packageJson.pnpm = {}
}
if (!packageJson.pnpm.overrides) {
  packageJson.pnpm.overrides = {}
}

if (action === 'link') {
  for (const [pkg, value] of Object.entries(sdkOverrides)) {
    packageJson.pnpm.overrides[pkg] = value
  }
  console.log('Linked SDK packages via pnpm overrides')
} else {
  for (const pkg of Object.keys(sdkOverrides)) {
    delete packageJson.pnpm.overrides[pkg]
  }
  console.log('Unlinked SDK packages from pnpm overrides')
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
