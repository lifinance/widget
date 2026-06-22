import { describe, expect, it } from 'vitest'
import type { WidgetConfig } from '../../types/widget.js'
import {
  getInitialActiveTab,
  getNavigationTabKeys,
  getTabMode,
  getTabModeOptions,
  getTabSplitMode,
  getTabVariant,
  splitTabKeys,
} from './utils.js'

const config = (overrides: Partial<WidgetConfig> = {}): WidgetConfig =>
  overrides as WidgetConfig

describe('getNavigationTabKeys', () => {
  it('prefers configured tabs, else split tabs, else none', () => {
    expect(
      getNavigationTabKeys(config({ _navigationTabs: ['private'] }))
    ).toEqual(['private'])
    expect(getNavigationTabKeys(config({ mode: 'split' }))).toEqual(
      splitTabKeys
    )
    expect(
      getNavigationTabKeys(
        config({ mode: 'split', modeOptions: { split: 'swap' } })
      )
    ).toEqual([])
  })
})

describe('getInitialActiveTab', () => {
  it('seeds the first configured tab or the split selection', () => {
    expect(
      getInitialActiveTab(config({ _navigationTabs: ['refuel', 'private'] }))
    ).toBe('refuel')
    expect(
      getInitialActiveTab(
        config({ mode: 'split', modeOptions: { split: 'bridge' } })
      )
    ).toBe('bridge')
    expect(getInitialActiveTab(config({ mode: 'default' }))).toBeUndefined()
  })
})

describe('getTabSplitMode', () => {
  it('resolves split tabs to their side, undefined otherwise', () => {
    expect(getTabSplitMode('swap-advanced')).toBe('swap')
    expect(getTabSplitMode('bridge')).toBe('bridge')
    expect(getTabSplitMode('default')).toBeUndefined()
  })
})

describe('per-tab config derivation', () => {
  it('uses the tab preset, falling back to config', () => {
    expect(getTabVariant(config({ variant: 'compact' }), 'default')).toBe(
      'wide'
    )
    expect(getTabVariant(config({ variant: 'compact' }), 'swap')).toBe(
      'compact'
    )
    expect(getTabMode(config({ mode: 'default' }), 'refuel')).toBe('refuel')
    expect(getTabModeOptions(config(), 'private')).toEqual({ split: 'swap' })
  })
})
