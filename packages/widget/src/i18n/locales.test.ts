import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// One check for both packages, so wallet-management keeps no copy of it.
const localeDirs = {
  widget: fileURLToPath(new URL('.', import.meta.url)),
  'wallet-management': fileURLToPath(
    new URL('../../../wallet-management/src/i18n/', import.meta.url)
  ),
}

type Messages = { [key: string]: string | Messages }

type ExpectedValue = {
  source: string
  plural: boolean
  countRequired: boolean
}

const pluralPattern = /^(.*)_(zero|one|two|few|many|other)$/
const categoryOrder = ['zero', 'one', 'two', 'few', 'many', 'other']

const flatten = (
  messages: Messages,
  prefix = '',
  out = new Map<string, string>()
) => {
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      out.set(path, value)
    } else {
      flatten(value, path, out)
    }
  }
  return out
}

const placeholders = (text: string) =>
  new Set(
    [...text.matchAll(/\{\{([^}]*)\}\}/g)].map((match) =>
      match[1].replace(/\s+/g, '').replace(/^-/, '')
    )
  )
const nestings = (text: string) =>
  new Set(
    [...text.matchAll(/\$t\(([^)]*)\)/g)].map((match) =>
      match[1].replace(/\s+/g, '')
    )
  )
const tags = (text: string) =>
  [...text.matchAll(/<\/?\s*[A-Za-z0-9]+\s*\/?>/g)]
    .map((match) => match[0].replace(/\s+/g, ''))
    .sort()
const withoutCount = (values: Set<string>) =>
  new Set([...values].filter((value) => !/^count\b/.test(value)))
const hasCount = (text: string) => /\{\{\s*-?\s*count\b/.test(text)
const sameSet = (a: Set<string>, b: Set<string>) =>
  a.size === b.size && [...a].every((value) => b.has(value))

// "one" also covers 0 in French and 21 in Ukrainian, so it needs {{count}}.
const oneCoversMore = (lng: string) => {
  const rules = new Intl.PluralRules(lng)
  for (let n = 0; n <= 200; n++) {
    if (n !== 1 && rules.select(n) === 'one') {
      return true
    }
  }
  return false
}

const expectedKeys = (en: Map<string, string>, lng: string) => {
  const categories: Set<string> = new Set(
    new Intl.PluralRules(lng).resolvedOptions().pluralCategories
  )
  const expected = new Map<string, ExpectedValue>()
  const done = new Set<string>()
  for (const [key, value] of en) {
    const base = key.match(pluralPattern)?.[1]
    if (base === undefined || !en.has(`${base}_other`)) {
      expected.set(key, { source: value, plural: false, countRequired: false })
      continue
    }
    if (done.has(base)) {
      continue
    }
    done.add(base)
    const other = en.get(`${base}_other`) as string
    for (const category of categoryOrder) {
      const isZero = category === 'zero' && en.has(`${base}_zero`)
      if (!categories.has(category) && !isZero) {
        continue
      }
      expected.set(`${base}_${category}`, {
        source: en.get(`${base}_${category}`) ?? other,
        plural: true,
        countRequired:
          hasCount(other) &&
          category !== 'zero' &&
          (category !== 'one' || oneCoversMore(lng)),
      })
    }
  }
  return expected
}

const findProblems = (
  en: Map<string, string>,
  locale: Map<string, string>,
  lng: string
) => {
  const problems: string[] = []
  const expected = expectedKeys(en, lng)
  for (const [key, { source, plural, countRequired }] of expected) {
    const value = locale.get(key)
    if (value === undefined) {
      problems.push(`${key}: missing`)
      continue
    }
    if (value.trim() === '') {
      problems.push(`${key}: empty`)
      continue
    }
    let wanted = placeholders(source)
    let found = placeholders(value)
    if (plural) {
      wanted = withoutCount(wanted)
      found = withoutCount(found)
      if (countRequired && !hasCount(value)) {
        problems.push(`${key}: needs {{count}}`)
      }
    }
    if (!sameSet(wanted, found)) {
      const list = [...wanted].map((name) => `{{${name}}}`).join(' ')
      problems.push(`${key}: placeholders must be ${list || 'none'}`)
    }
    if (!sameSet(nestings(source), nestings(value))) {
      problems.push(`${key}: $t() must be the same as in en.json`)
    }
    if (tags(source).join() !== tags(value).join()) {
      problems.push(`${key}: tags must be ${tags(source).join(' ') || 'none'}`)
    }
  }
  for (const key of locale.keys()) {
    if (!expected.has(key)) {
      problems.push(`${key}: not in en.json, remove it`)
    }
  }
  return problems
}

describe.each(Object.entries(localeDirs))('%s locale files', (_, dir) => {
  const read = (file: string): Map<string, string> =>
    flatten(JSON.parse(readFileSync(join(dir, file), 'utf8')))
  const en = read('en.json')
  const languages = readdirSync(dir)
    .filter((file) => file.endsWith('.json') && file !== 'en.json')
    .map((file) => file.replace(/\.json$/, ''))

  it('has locale files', () => {
    expect(languages.length).toBeGreaterThan(0)
  })

  it.each(languages)('%s.json matches en.json', (lng) => {
    expect(
      findProblems(en, read(`${lng}.json`), lng),
      `Fix these keys in ${lng}.json. See TRANSLATING.md.`
    ).toEqual([])
  })
})
