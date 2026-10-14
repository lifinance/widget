/** @vitest-environment happy-dom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WidgetConfig } from '../../types/widget.js'
import type { WidgetContextProps } from './types.js'

const settingsActions = { setDefaultSettings: vi.fn() }
vi.mock('../../stores/settings/useSettingsActions.js', () => ({
  useSettingsActions: () => settingsActions,
}))

import { useWidgetConfig, WidgetProvider } from './WidgetProvider.js'

let root: Root
let seen: WidgetContextProps | undefined

const Probe = () => {
  seen = useWidgetConfig()
  return null
}

const render = async (config: WidgetConfig) => {
  await act(async () => {
    root.render(
      <WidgetProvider config={config}>
        <Probe />
      </WidgetProvider>
    )
  })
}

describe('WidgetProvider scope keys', () => {
  beforeEach(() => {
    seen = undefined
    const container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
  })

  // An integration that only ever set the deprecated keyPrefix keeps its
  // isolation: everything below reads the resolved keys, never keyPrefix.
  it('resolves both scopes from keyPrefix alone', async () => {
    await render({ integrator: 'test', keyPrefix: 'legacy' })

    expect(seen?.storageScopeKey).toBe('legacy')
    expect(seen?.queryScopeKey).toBe('legacy')
  })

  it('prefers the explicit scopes over keyPrefix', async () => {
    await render({
      integrator: 'test',
      keyPrefix: 'legacy',
      storageScopeKey: 'store',
      queryScopeKey: 'query',
    })

    expect(seen?.storageScopeKey).toBe('store')
    expect(seen?.queryScopeKey).toBe('query')
  })

  it('keeps the historical storage names and the default query scope when nothing is set', async () => {
    await render({ integrator: 'test' })

    expect(seen?.storageScopeKey).toBeUndefined()
    expect(seen?.queryScopeKey).toBe('li.fi')
  })
})
