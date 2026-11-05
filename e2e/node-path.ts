import { realpathSync } from 'node:fs'
import { delimiter, join } from 'node:path'

// `bunx --bun` prepends a `node` -> bun shim to PATH; strip it so the servers
// under test (vite build/preview/dev via pnpm) run on real Node, not Bun.
// The shim is matched by identity, not by directory name.
const bunExec = (() => {
  try {
    return realpathSync(process.execPath)
  } catch {
    return ''
  }
})()

// Only on Bun: under Node, execPath is real Node and must stay on PATH.
export const nodePath = !process.versions.bun
  ? process.env.PATH
  : (process.env.PATH ?? '')
      .split(delimiter)
      .filter((dir) => {
        try {
          return realpathSync(join(dir, 'node')) !== bunExec
        } catch {
          return true
        }
      })
      .join(delimiter)
