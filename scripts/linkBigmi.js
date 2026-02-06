// biome-ignore-all lint/suspicious/noConsole: allowed in scripts
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.resolve(__dirname, '..', 'package.json')

const bigmiOverrides = {
  '@bigmi/client':
    'link:../../Library/pnpm/global/5/node_modules/@bigmi/client',
  '@bigmi/core': 'link:../../Library/pnpm/global/5/node_modules/@bigmi/core',
  '@bigmi/react': 'link:../../Library/pnpm/global/5/node_modules/@bigmi/react',
}

const action = process.argv[2]

if (!['link', 'unlink'].includes(action)) {
  console.error('Usage: node linkBigmi.js <link|unlink>')
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
  for (const [pkg, value] of Object.entries(bigmiOverrides)) {
    packageJson.pnpm.overrides[pkg] = value
  }
  console.log('Linked bigmi packages via pnpm overrides')
} else {
  for (const pkg of Object.keys(bigmiOverrides)) {
    delete packageJson.pnpm.overrides[pkg]
  }
  console.log('Unlinked bigmi packages from pnpm overrides')
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
