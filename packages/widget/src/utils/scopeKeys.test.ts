/** @vitest-environment happy-dom */

import { describe, expect, it } from 'vitest'
import { createBookmarksStore } from '../stores/bookmarks/createBookmarkStore.js'
import {
  defaultQueryScopeKey,
  resolveQueryScopeKey,
  resolveStorageScopeKey,
} from './scopeKeys.js'

// The stores' declared type hides zustand's persist API, which only exists at
// runtime when localStorage does.
const persistedName = (store: unknown): string | undefined =>
  (
    store as { persist: { getOptions: () => { name?: string } } }
  ).persist.getOptions().name

describe('resolveStorageScopeKey', () => {
  it('uses storageScopeKey when set', () => {
    expect(
      resolveStorageScopeKey({ storageScopeKey: 'host-main', keyPrefix: 'x' })
    ).toBe('host-main')
  })

  it('falls back to the deprecated keyPrefix', () => {
    expect(resolveStorageScopeKey({ keyPrefix: 'host-main' })).toBe('host-main')
  })

  it('is undefined when neither is set, keeping the historical li.fi-* names', () => {
    expect(resolveStorageScopeKey({})).toBeUndefined()
    expect(resolveStorageScopeKey(undefined)).toBeUndefined()
  })

  // Renaming keyPrefix to storageScopeKey must not orphan anyone's persisted
  // bookmarks, pinned tokens, recent tokens, chain order or route history.
  it('keeps persisted store names byte-identical after the rename', () => {
    const before = createBookmarksStore({
      namePrefix: resolveStorageScopeKey({ keyPrefix: 'host-main' }),
    })
    const after = createBookmarksStore({
      namePrefix: resolveStorageScopeKey({ storageScopeKey: 'host-main' }),
    })

    expect(persistedName(after)).toBe(persistedName(before))
    expect(persistedName(after)).toBe('host-main-bookmarks')
  })
})

describe('resolveQueryScopeKey', () => {
  it('uses queryScopeKey when set', () => {
    expect(
      resolveQueryScopeKey({
        queryScopeKey: 'host',
        keyPrefix: 'host-main',
      })
    ).toBe('host')
  })

  // A partner that only ever set keyPrefix keeps exactly today's isolation.
  it('falls back to the deprecated keyPrefix', () => {
    expect(resolveQueryScopeKey({ keyPrefix: 'partner-a' })).toBe('partner-a')
  })

  // An integration that sets nothing is still scoped away from the host's own
  // query keys.
  it('defaults to a constant scope', () => {
    expect(resolveQueryScopeKey({})).toBe(defaultQueryScopeKey)
    expect(resolveQueryScopeKey(undefined)).toBe(defaultQueryScopeKey)
  })

  it('does not follow storageScopeKey — the two scopes are independent', () => {
    expect(resolveQueryScopeKey({ storageScopeKey: 'host-main' })).toBe(
      defaultQueryScopeKey
    )
  })
})
