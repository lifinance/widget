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

/**
 * Regression cover for JUM-1733.
 *
 * With `languages.default` set and nothing saved, the i18n instance starts in
 * that language before its strings load. The label is memoized, like the
 * navigation tabs, so only an i18n event can re-render it once the strings
 * arrive.
 */

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

    await vi.waitFor(() => expect(container.textContent).toBe('Gaz'))
  })
})
