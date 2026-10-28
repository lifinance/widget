/** @vitest-environment happy-dom */

import { act, memo } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsStoreProvider } from '../../stores/settings/SettingsStore.js'
import type { WidgetConfig } from '../../types/widget.js'
import type { WidgetContextProps } from '../WidgetProvider/types.js'
import { WidgetContext } from '../WidgetProvider/WidgetProvider.js'
import { I18nProvider } from './I18nProvider.js'

const seedSettings = (state: Record<string, unknown>) =>
  window.localStorage.setItem(
    'li.fi-widget-settings',
    JSON.stringify({ state, version: 6 })
  )

const staleFrenchCache = { header: { gas: 'Old' } }

// Memoized, so only an i18n event can re-render it once the strings load.
const GasLabel = memo(() => {
  const { t } = useTranslation()
  return <span>{t('header.gas')}</span>
})

let root: Root
let container: HTMLDivElement

const render = (config: WidgetConfig) => {
  act(() => {
    root.render(
      <WidgetContext value={config as WidgetContextProps}>
        <SettingsStoreProvider config={config}>
          <I18nProvider>
            <GasLabel />
          </I18nProvider>
        </SettingsStoreProvider>
      </WidgetContext>
    )
  })
}

beforeEach(() => {
  ;(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  window.localStorage.clear()
  container = document.createElement('div')
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
})

describe('I18nProvider', () => {
  it('shows the default language once its strings load, with nothing saved', async () => {
    render({ integrator: 'test', languages: { default: 'fr' } })
    expect(container.textContent).toBe('Gas')

    await vi.waitFor(() => expect(container.textContent).toBe('Gaz'))
  })

  it('replaces an old saved cache of the default language', async () => {
    seedSettings({
      language: 'fr',
      lastDefaultLanguage: 'fr',
      languageCache: staleFrenchCache,
    })
    render({ integrator: 'test', languages: { default: 'fr' } })
    expect(container.textContent).toBe('Old')

    await vi.waitFor(() => expect(container.textContent).toBe('Gaz'))
  })

  it('replaces an old saved cache of the saved language', async () => {
    seedSettings({ language: 'fr', languageCache: staleFrenchCache })
    render({ integrator: 'test' })
    expect(container.textContent).toBe('Old')

    await vi.waitFor(() => expect(container.textContent).toBe('Gaz'))
  })
})
