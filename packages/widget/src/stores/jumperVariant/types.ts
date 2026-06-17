import type { StoreApi, UseBoundStore } from 'zustand'
import type { JumperTier, ModeOptions, WidgetMode } from '../../types/widget.js'

export type JumperTabKey =
  | 'exchange'
  | 'private'
  | 'gas'
  | 'swap'
  | 'bridge'
  | 'limit'

export interface JumperTab {
  /** Stable, language-independent identity; resolved to a label via a hook. */
  key: JumperTabKey
  mode: WidgetMode
  modeOptions?: ModeOptions
}

export interface JumperVariantValue {
  /** Key of the active tab; resolved to a `JumperTab` via {@link getJumperTab}. */
  tabKey: JumperTabKey
  /** Active view tier, toggled by the rail. */
  tier: JumperTier
}

export interface JumperVariantState {
  /** The jumper navigation state, or `undefined` outside the `jumper` variant. */
  state?: JumperVariantValue
  setState(state: Partial<JumperVariantValue>): void
}

export type JumperVariantStore = UseBoundStore<StoreApi<JumperVariantState>>
