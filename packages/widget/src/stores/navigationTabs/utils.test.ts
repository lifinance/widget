import { describe, expect, it } from 'vitest'
import type { NavigationTabConfig, WidgetConfig } from '../../types/widget.js'
import {
  getInitialActiveTab,
  getNavigationTabs,
  resolveSplitMode,
} from './utils.js'

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

describe('resolveSplitMode', () => {
  it('derives split mode from the active tab when tabs are configured', () => {
    const tabs = [
      tab('swap', { mode: 'split', modeOptions: { split: 'swap' } }),
      tab('bridge', { mode: 'split', modeOptions: { split: 'bridge' } }),
    ]
    const widgetConfig = config({ _navigationTabs: tabs, mode: 'split' })
    expect(resolveSplitMode(widgetConfig, 'bridge')).toBe('bridge')
    expect(resolveSplitMode(widgetConfig, 'swap')).toBe('swap')
  })

  it('returns undefined when the active tab is not in split mode', () => {
    const tabs = [tab('refuel', { mode: 'refuel' }), tab('private')]
    // Even though the widget config is split, the active (non-split) tab wins.
    const widgetConfig = config({ _navigationTabs: tabs, mode: 'split' })
    expect(resolveSplitMode(widgetConfig, 'refuel')).toBeUndefined()
  })

  it('resolves implicit split tabs (swap/bridge) when none are configured', () => {
    const widgetConfig = config({ mode: 'split' })
    expect(resolveSplitMode(widgetConfig, 'swap')).toBe('swap')
    expect(resolveSplitMode(widgetConfig, 'bridge')).toBe('bridge')
  })

  it('falls back to the widget config when there are no tabs at all', () => {
    expect(
      resolveSplitMode(
        config({ mode: 'split', modeOptions: { split: 'swap' } })
      )
    ).toBe('swap')
    expect(resolveSplitMode(config({ mode: 'default' }))).toBeUndefined()
  })
})
