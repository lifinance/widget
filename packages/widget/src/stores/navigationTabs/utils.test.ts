import { describe, expect, it } from 'vitest'
import type { NavigationTabConfig, WidgetConfig } from '../../types/widget.js'
import { getInitialActiveTab, getNavigationTabs } from './utils.js'

const config = (overrides: Partial<WidgetConfig> = {}): WidgetConfig =>
  overrides as WidgetConfig

const tab = (
  tabKey: NavigationTabConfig['tabKey'],
  config: NavigationTabConfig['config'] = {}
): NavigationTabConfig => ({ tabKey, config })

describe('getNavigationTabs', () => {
  it('prefers configured tabs, else split tabs, else none', () => {
    const tabs = [tab('private', { mode: 'split' })]
    expect(getNavigationTabs(config({ _navigationTabs: tabs }))).toBe(tabs)
    expect(
      getNavigationTabs(config({ mode: 'split' })).map((t) => t.tabKey)
    ).toEqual(['swap', 'bridge'])
    expect(
      getNavigationTabs(
        config({ mode: 'split', modeOptions: { split: 'swap' } })
      )
    ).toEqual([])
  })
})

describe('getInitialActiveTab', () => {
  it('seeds the first configured tab or the split selection', () => {
    expect(
      getInitialActiveTab(
        config({ _navigationTabs: [tab('refuel'), tab('private')] })
      )
    ).toBe('refuel')
    expect(
      getInitialActiveTab(
        config({ mode: 'split', modeOptions: { split: 'bridge' } })
      )
    ).toBe('bridge')
    expect(getInitialActiveTab(config({ mode: 'default' }))).toBeUndefined()
  })
})
