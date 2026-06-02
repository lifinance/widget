import { applyOverrides } from './workspaceOverrides.js'

const sdkPackages = [
  '@lifi/sdk',
  '@lifi/sdk-provider-bitcoin',
  '@lifi/sdk-provider-ethereum',
  '@lifi/sdk-provider-solana',
  '@lifi/sdk-provider-sui',
  '@lifi/sdk-provider-tron',
]

const action = process.argv[2]

if (!['link', 'unlink'].includes(action)) {
  console.error('Usage: node linkSdk.js <link|unlink>')
  process.exit(1)
}

applyOverrides(sdkPackages, 'sdk', action)
