import type { Order } from '@lifi/sdk'
import type { PropsWithChildren } from 'react'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { LanguageResource } from '../../providers/I18nProvider/types.js'
import type { SplitSubvariant, WidgetConfig } from '../../types/widget.js'

export type ValueSetter<S> = <K extends keyof S>(
  key: K,
  value: S[Extract<K, string>]
) => void

type ValueGetter<S> = <K extends keyof S>(key: K) => S[K]

export const SettingsToolTypes = ['Bridges', 'Exchanges'] as const
export type SettingsToolType = (typeof SettingsToolTypes)[number]

export interface SettingsProps {
  gasPrice?: string
  language?: string
  languageCache?: LanguageResource
  defaultLanguage?: string
  defaultLanguageCache?: LanguageResource
  fallbackLanguage?: string
  fallbackLanguageCache?: LanguageResource
  routePriority?: Order
  enabledAutoRefuel: boolean
  slippage?: string
  disabledBridges: string[]
  enabledBridges: string[]
  _enabledBridges: Record<string, boolean>
  disabledExchanges: string[]
  enabledExchanges: string[]
  _enabledExchanges: Record<string, boolean>
}

export interface SettingsActions {
  setValue: ValueSetter<SettingsProps>
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

interface SendToWalletState {
  showSendToWallet: boolean
}

export interface SendToWalletStore extends SendToWalletState {
  setSendToWallet(value: boolean): void
}

export interface SplitSubvariantState {
  state?: SplitSubvariant
  setState(state: SplitSubvariant): void
}

export type SplitSubvariantStore = UseBoundStoreWithEqualityFn<
  StoreApi<SplitSubvariantState>
>

export interface SplitSubvariantProps {
  state?: SplitSubvariant
}

export type SplitSubvariantProviderProps =
  PropsWithChildren<SplitSubvariantProps>

export interface SettingsStoreProviderProps {
  config: WidgetConfig
}
