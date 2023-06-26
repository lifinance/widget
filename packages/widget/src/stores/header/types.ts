import type { StoreApi, UseBoundStore } from 'zustand';

export type HeaderStore = UseBoundStore<StoreApi<HeaderState>>;

export interface HeaderStateBase {
  element?: React.ReactNode | null;
  title?: string;
}

export interface HeaderState extends HeaderStateBase {
  setAction(element?: React.ReactNode | null): () => void;
  setTitle(title?: string): () => void;
  removeAction(): void;
  removeTitle(): void;
}
