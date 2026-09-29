import { describe, expect, it, vi } from 'vitest'
import type { WidgetConfig } from '../../types/widget.js'

const { persistNames } = vi.hoisted(() => ({ persistNames: [] as string[] }))

vi.mock('zustand/middleware', async (importOriginal) => {
  const actual = await importOriginal<typeof import('zustand/middleware')>()
  return {
    ...actual,
    persist: ((initializer, options) => {
      persistNames.push(options.name)
      return actual.persist(initializer, options)
    }) as typeof actual.persist,
  }
})

const { createSettingsStore } = await import('./createSettingsStore.js')

// Settings were never namespaced by keyPrefix, and the scope keys keep it
// that way: renaming the key would drop every user's saved settings.
describe('createSettingsStore storage name', () => {
  it('keeps one name whatever the scope keys are', () => {
    createSettingsStore({} as WidgetConfig)
    createSettingsStore({
      storageScopeKey: 'scoped',
      queryScopeKey: 'queries',
      keyPrefix: 'legacy',
    } as WidgetConfig)

    expect(persistNames).toEqual([
      'li.fi-widget-settings',
      'li.fi-widget-settings',
    ])
  })
})
