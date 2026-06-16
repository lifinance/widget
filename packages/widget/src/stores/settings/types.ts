import type { Order } from '@lifi/sdk'
import type { LanguageResource } from '../../providers/I18nProvider/types.js'
import type { WidgetConfig } from '../../types/widget.js'

export type ValueSetter<S> = <K extends keyof S>(
  key: K,
  value: S[Extract<K, string>]
) => void

type ValueGetter<S> = <K extends keyof S>(key: K) => S[K]

export const SettingsToolTypes = ['Bridges', 'Exchanges'] as const
export type SettingsToolType = (typeof SettingsToolTypes)[number]

export const RouteTypes = ['all', 'private'] as const
export type RouteType = (typeof RouteTypes)[number]

export interface SettingsProps {
  gasPrice?: string
  language?: string
  languageCache?: LanguageResource
  lastDefaultLanguage?: string
  routePriority?: Order
  // TODO: display-only for now — the SDK has no route-type/privacy parameter,
  // so this setting does not yet affect routing. Wire into useRoutes once supported.
  routeType?: RouteType
  enabledAutoRefuel: boolean
  slippage?: string
  disabledBridges: string[]
  enabledBridges: string[]
  _enabledBridges: Record<string, boolean>
  disabledExchanges: string[]
  enabledExchanges: string[]
  _enabledExchanges: Record<string, boolean>
  smallBalanceThreshold?: string
}

export interface SettingsActions {
  setValue: ValueSetter<SettingsProps>
  setValues: (values: Partial<SettingsProps>) => void
  getValue: ValueGetter<SettingsProps>
  getSettings: () => SettingsProps
  initializeTools(
    toolType: SettingsToolType,
    tools: string[],
    reset?: boolean
  ): void
  setToolValue(toolType: SettingsToolType, tool: string, value: boolean): void
  toggleToolKeys(toolType: SettingsToolType, toolKeys: string[]): void
  reset(bridges: string[], exchanges: string[]): void
}

export type SettingsState = SettingsProps & SettingsActions

export interface SettingsStoreProviderProps {
  config: WidgetConfig
}
