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

export function applyOverrides(packages, label, action) {
  const overrides = Object.fromEntries(
    packages.map((pkg) => [pkg, `link:${path.join(globalModules, pkg)}`])
  )
  const marker = `  # LOCAL ONLY — do not commit (${label} link)`

  let content = fs.readFileSync(workspacePath, 'utf-8')

  const { cleaned, blockStart } = removeOverrides(content, packages, label)
  content = cleaned

  if (!content.endsWith('\n')) {
    content += '\n'
  }

  if (action === 'link') {
    const lines = packages.map((pkg) => `  '${pkg}': '${overrides[pkg]}'`)
    const block = `${marker}\n${lines.join('\n')}\n`

    if (blockStart !== -1) {
      content = content.slice(0, blockStart) + block + content.slice(blockStart)
    } else {
      content += `overrides:\n${block}`
    }
    console.log(
      `Linked ${label} packages via pnpm-workspace.yaml overrides. DO NOT commit pnpm-workspace.yaml while linked.`
    )
  } else {
    console.log(`Unlinked ${label} packages from pnpm-workspace.yaml overrides`)
  }

  fs.writeFileSync(workspacePath, content)
}

function removeOverrides(yaml, packages, label) {
  const header = yaml.match(/^overrides:[ \t]*\r?\n/m)
  if (!header) {
    return { cleaned: yaml, blockStart: -1 }
  }

  const blockStart = header.index + header[0].length
  const nextKey = yaml.slice(blockStart).match(/^[^\s#]/m)
  const blockEnd = nextKey ? blockStart + nextKey.index : yaml.length

  const before = yaml.slice(0, blockStart)
  let block = yaml.slice(blockStart, blockEnd)
  const after = yaml.slice(blockEnd)

  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  block = block.replace(
    new RegExp(`^\\s*# LOCAL ONLY.*\\(${escapedLabel} link\\).*\\r?\\n`, 'gm'),
    ''
  )
  for (const pkg of packages) {
    const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    block = block.replace(
      new RegExp(`^\\s+['"]?${escaped}['"]?\\s*:.*\\r?\\n`, 'gm'),
      ''
    )
  }

  const cleaned = before + block + after
  return { cleaned, blockStart: before.length }
}
