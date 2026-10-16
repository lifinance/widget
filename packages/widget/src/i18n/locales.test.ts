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
// Rule 7: names that stay in English. Add a name when an English text gets
// one. Full names only: "Pass" and "Scan" are also section names, which a
// locale with its own script writes in that script.
const brandNames = [
  'Jumper',
  'LI.FI',
  'Composer',
  'Perps',
  'RWA',
  'Abstract',
  'Ethereum',
  'SEI',
  'Solana',
  'Stellar',
  'Zcash',
  'USDC',
  'ENS',
  'Hypernative',
  'MetaMask',
  'Orchard',
  'Sapling',
  'SNS',
  'Transak',
  'Velora',
  'Discord',
  'Facebook',
  'GitHub',
  'LinkedIn',
].map((name) => ({
  name,
  // Whole words in English, so "ENS" does not match "TOKENS".
  pattern: new RegExp(
    `(?<![\\p{L}\\p{N}])${name.replaceAll('.', '\\.')}(?![\\p{L}\\p{N}])`,
    'u'
  ),
}))
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
    // ja and zh put a letter right after a name ("Jumperの"), so no word
    // boundary here.
    for (const { name, pattern } of brandNames) {
      if (pattern.test(source) && !value.includes(name)) {
        problems.push(`${key}: keep "${name}" in English`)
      }
    }
  }
  for (const key of locale.keys()) {
    if (!expected.has(key)) {
      problems.push(`${key}: not in en.json, remove it`)
    }
  }
  const order = [...locale.keys()].filter((key) => expected.has(key))
  const wantedOrder = [...expected.keys()].filter((key) => locale.has(key))
  const moved = order.findIndex((key, index) => key !== wantedOrder[index])
  if (moved !== -1) {
    problems.push(
      `${order[moved]}: wrong position, en.json has ${wantedOrder[moved]} here`
    )
  }
  return problems
}

describe('findProblems', () => {
  const en = new Map([
    ['title', 'Welcome to Jumper'],
    ['swap', 'Swap'],
    ['bridge', 'Bridge'],
  ])
  const fr = () =>
    new Map([
      ['title', 'Bienvenue sur Jumper'],
      ['swap', 'Échanger'],
      ['bridge', 'Bridge'],
    ])

  it('passes a complete locale', () => {
    expect(findProblems(en, fr(), 'fr')).toEqual([])
  })

  it('names an empty value', () => {
    expect(findProblems(en, fr().set('swap', ''), 'fr')).toEqual([
      'swap: empty',
    ])
  })

  it('names a deleted key', () => {
    const locale = fr()
    locale.delete('swap')
    expect(findProblems(en, locale, 'fr')).toEqual(['swap: missing'])
  })

  it('names a key at the wrong position (rule 4)', () => {
    const locale = new Map([
      ['title', 'Bienvenue sur Jumper'],
      ['bridge', 'Bridge'],
      ['swap', 'Échanger'],
    ])
    expect(findProblems(en, locale, 'fr')).toEqual([
      'bridge: wrong position, en.json has swap here',
    ])
  })

  it('names a translated brand name (rule 7)', () => {
    expect(
      findProblems(en, fr().set('title', 'Bienvenue sur Sauteur'), 'fr')
    ).toEqual(['title: keep "Jumper" in English'])
  })
})

describe.each(Object.entries(localeDirs))('%s locale files', (name, dir) => {
  const read = (file: string): Map<string, string> =>
    flatten(JSON.parse(readFileSync(join(dir, file), 'utf8')))
  const en = read('en.json')

  // Rule 2: the copy holds the English text that the locales come from. CI
  // does not write snapshots, so a changed English text fails here.
  it('has the English text that the locales come from', async () => {
    await expect(
      `${JSON.stringify(Object.fromEntries(en), null, 2)}\n`,
      'An English text changed. Translate the changed keys again in every locale file of that folder, then run this test with -u. See TRANSLATING.md.'
    ).toMatchFileSnapshot(`./__snapshots__/${name}.en.json`)
  })
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
