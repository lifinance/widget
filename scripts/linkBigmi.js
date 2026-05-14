import { applyOverrides } from './workspaceOverrides.js'

const bigmiPackages = ['@bigmi/client', '@bigmi/core', '@bigmi/react']

const action = process.argv[2]

if (!['link', 'unlink'].includes(action)) {
  console.error('Usage: node linkBigmi.js <link|unlink>')
  process.exit(1)
}

applyOverrides(bigmiPackages, 'bigmi', action)
