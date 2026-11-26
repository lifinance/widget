/* oxlint-disable no-console -- allowed in scripts */
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

  const content = fs.readFileSync(workspacePath, 'utf-8')
  const eol = content.includes('\r\n') ? '\r\n' : '\n'
  const lines = content.split(/\r?\n/)
  if (lines[lines.length - 1] === '') {
    lines.pop()
  }

  const { insertIdx, conflicts } = removeOverrides(lines, packages, label)

  if (action === 'link') {
    if (conflicts.length > 0) {
      throw new Error(
        `pnpm-workspace.yaml already has an override outside the ${label} link block: ${conflicts.join(', ')}. Remove it manually.`
      )
    }
    const block = [
      marker,
      ...packages.map((pkg) => `  '${pkg}': '${overrides[pkg]}'`),
    ]
    if (insertIdx !== -1) {
      lines.splice(insertIdx, 0, ...block)
    } else {
      lines.push('overrides:', ...block)
    }
    console.log(
      `Linked ${label} packages via pnpm-workspace.yaml overrides. DO NOT commit pnpm-workspace.yaml while linked.`
    )
  } else {
    console.log(`Unlinked ${label} packages from pnpm-workspace.yaml overrides`)
  }

  fs.writeFileSync(workspacePath, lines.join(eol) + eol)
}

// Mutates `lines`. Removes only our marker line and the contiguous entries
// right below it whose keys are in `packages`. Foreign entries are never removed.
function removeOverrides(lines, packages, label) {
  const headerIdx = lines.findIndex((l) => /^overrides:[ \t]*$/.test(l))
  if (headerIdx === -1) {
    return { insertIdx: -1, conflicts: [] }
  }

  let end = lines.length
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (/^[^\s#]/.test(lines[i])) {
      end = i
      break
    }
  }

  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const markerRe = new RegExp(`^[ \\t]*# LOCAL ONLY.*\\(${escapedLabel} link\\)`)
  const wanted = new Set(packages)
  const keyOf = (line) => {
    const m = line.match(
      /^[ \t]+(?:'([^']+)'|"([^"]+)"|([^\s:#'"][^:]*?))[ \t]*:/
    )
    return m ? (m[1] ?? m[2] ?? m[3]) : null
  }

  let markerIdx = -1
  for (let i = headerIdx + 1; i < end; i++) {
    if (markerRe.test(lines[i])) {
      markerIdx = i
      break
    }
  }

  if (markerIdx !== -1) {
    let count = 1
    while (
      markerIdx + count < end &&
      wanted.has(keyOf(lines[markerIdx + count]))
    ) {
      count++
    }
    lines.splice(markerIdx, count)
    end -= count
  }

  const conflicts = []
  for (let i = headerIdx + 1; i < end; i++) {
    const key = keyOf(lines[i])
    if (key && wanted.has(key)) {
      conflicts.push(key)
    }
  }

  return { insertIdx: markerIdx !== -1 ? markerIdx : headerIdx + 1, conflicts }
}
