import type { StoreApi, UseBoundStore } from 'zustand'

export type HeaderStore = UseBoundStore<StoreApi<HeaderState>>

interface HeaderStateBase {
  element?: React.ReactNode | null
  title?: string
  headerHeight: number
  backAction?: () => void
}

export interface HeaderState extends HeaderStateBase {
  setAction(element?: React.ReactNode | null): () => void
  setTitle(title?: string): () => void
  removeAction(): void
  removeTitle(): void
  setHeaderHeight(headerHeight: number): void
  setBackAction(action: () => void): void
  executeBackAction(): void
}
